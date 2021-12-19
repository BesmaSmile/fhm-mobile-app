import { actions } from '../store/reducers/actions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import profileService from './profile.service';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import _ from 'lodash';

GoogleSignin.configure({
  webClientId: '971389423387-47ren0t2cc62ll7cq151gnu8toeijrd4.apps.googleusercontent.com',
});

//LoginManager.setLoginBehavior('web_only')

export default {
  emailSignUp,
  emailSignIn,
  googleSignIn,
  facebookSignIn,
  phoneSignIn,
  sendEmailVerification,
  isEmailVerified,
  storeTokens,
  storeUserInformations,
  getUserId,
  getCurrentUser,
  signIn,
  signOut
}

export const signInMethods={
  FACEBOOK  : 'FACEBOOK',
  GOOGLE : 'GOOGLE',
  EMAIL : 'EMAIL',
  PHONE : 'PHONE'
}

function googleSignIn() {
  let user;
  return GoogleSignin.signIn().then(user=>{
    const {idToken}=user
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  }).catch(error=>{
    if(error.message=="Sign in action cancelled")
      throw undefined;
    else cancelSignin(signInMethods.GOOGLE,false)
    throw 'Echec de connexion par compte Google'
  }).then((result)=>{
    user=result
    return profileService.loadUserProfile(getCurrentUser().uid)
    .catch(error=>{
      cancelSignin(signInMethods.GOOGLE,false)
      throw "Echec de connexion!"
    })
  }).then(userProfile => {
    if ((!userProfile|| (!userProfile.firstname && !userProfile.lastname))){
      const { given_name, family_name } = user.additionalUserInfo.profile
      return storeUserInformations(given_name, family_name)
      .catch(error=>{
        cancelSignin(signInMethods.GOOGLE,false)
        throw error
      })
    }
  })
}

async function facebookSignIn() {
  let user;
  return LoginManager.logInWithPermissions(['public_profile', 'email'])
  .catch(error=>{
    throw "Echec de connexion par compte Facebook !"
  })
  .then(result=>{

    if (result.isCancelled) {
      throw undefined
    }
    return AccessToken.getCurrentAccessToken()
    .catch(error=>{
      throw "Echec de connexion par compte Facebook !"
    });
  }).then(data=>{
    if (!data) {
      throw 'Echec de connexion par compte Facebook !';
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    return auth().signInWithCredential(facebookCredential)
      .catch(error=>{
        throw "Echec de connexion par compte Facebook !"
      })
  }).then((result)=>{
    user=result
    return profileService.loadUserProfile(getCurrentUser().uid)
    .catch(error=>{
      cancelSignin(signInMethods.FACEBOOK,false)
      throw "Echec de connexion!"
    })
  }).then(userProfile => {
      if ((!userProfile|| (!userProfile.firstname && !userProfile.lastname))){
        const { first_name, last_name } = user.additionalUserInfo.profile
        return storeUserInformations(first_name, last_name)
        .catch(error=>{ 
          cancelSignin(signInMethods.FACEBOOK,false)
          throw  error
        })
      }
  })
}

function emailSignUp(email, password, firstname, lastname) {
  return auth().createUserWithEmailAndPassword(email, password)//add user to firebase auth
    //store user informations
    .then(() => {
      return storeUserInformations(firstname, lastname)
      .catch(error => {
        throw { code: 'auth/informations-not-saved' }
      })
    //send verification email
    }).then(() => {
      return sendEmailVerification()
      .catch(error => {
        //if verification email failed, user should be deleted from firestore
        return deleteUser(getCurrentUser().uid).then(()=>{
          throw { code: 'auth/verification-email-not-send' }
        })
      })
    }).then(()=>{
      //user should not be connected before validating email
      _signOut(signInMethods.EMAIL)
    }).catch(error => {
      //if signup failed, user should be deleted firebase auth
      cancelSignin(signInMethods.EMAIL,true )
      let message = ""
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "Adresse mail utilisée"
          break;
        case "auth/invalid-email":
          message = "Adresse mail invalide"
          break;
        case "auth/operation-not-allowed":
          message = "Inscription par adresse mail non autorisée"
          break;
        case "auth/weak-password":
          message = "Mot de passe faible"
          break;
        case 'auth/informations-not-saved':
          message = "Echec d'enregistrement de vos informations"
          break;
        case 'auth/verification-email-not-send':
          message = "Echec d'envoi d'un email de vérification"
          break;
        default:
          message = "Echec d'inscription"
      }
      throw message
    })
}

function emailSignIn(email, password) {
  return auth().signInWithEmailAndPassword(email, password)
    .then(user => {
      if (!isEmailVerified())
        throw { code: 'auth/not-confirmed-email' }
    })
    .catch(error => {
      cancelSignin(signInMethods.EMAIL, false)
      let message = ""
      switch (error.code) {
        case 'auth/invalid-email':
          message = "Adresse mail invalide"
          break;
        case 'auth/user-disabled':
          message = "Votre compte a été désactivé"
          break;
        case 'auth/user-not-found':
          message = "Aucun compte ne correspond à cette addresse mail"
          break;
        case 'auth/wrong-password':
          message = "Mot de passe incorrecte"
          break;
        case 'auth/operation-not-allowed':
          message = "Connexion par adresse mail non autorisée"
          break;
        case 'auth/not-confirmed-email':
          message = "Vous n'avez pas encore confirmé votre email !"
          break;
        default:
          message = "Echec de connexion"
      }
      throw message
    })
}

function sendEmailVerification() {
  const actionCodeSettings = {
    url: 'htps://facihospitalitymaster2020.page.link',
    /*iOS: {
        bundleId: 'org.reactjs.native.example.passless',
    },*/
    /*android: {
        packageName: 'fhm.mobileapp',
        installApp: true,
        minimumVersion: '12',
    },*/
    handleCodeInApp: true,
  };

  return auth().currentUser.sendEmailVerification(actionCodeSettings)
}

function isEmailVerified() {
  if (auth().currentUser) return auth().currentUser.emailVerified
  else return undefined
}

function phoneSignIn(phoneNumber) {
  return async dispatch => {
    return auth().signInWithPhoneNumber(phoneNumber).then(confirmation => {
      dispatch(actions.confirmPhoneNumber(confirmation));
      return confirmation
    }).catch(error => {
      let message=''
      switch(error.code){
        case 'auth/invalid-phone-number':
          message='Numéro de téléphone invalide'
          break;
        default:
          message="Echec de connexion !"
          break;
      }
      throw message
      
    })

  }
}

function cancelSignin(signInMethod, deleteUser){
  if(auth().currentUser && deleteUser){
    auth().currentUser.delete() 
  }
  _signOut(signInMethod)
}

function deleteUser(uid){
  return firestore().doc(`users/${uid}`).delete()
}

function _storeToken(token) {
  const user = auth().currentUser
  return firestore().doc(`users/${user.uid}`)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    }).then(result => {
      return result
    }).catch(error => {
    });
}

function storeTokens() {
  messaging().getToken()
    .then(fcmToken => {
      if (fcmToken) {
        _storeToken(fcmToken)
      } else {
        console.log("no token");
      }
    })

  return messaging().onTokenRefresh(token => {
    _storeToken(token);
  })
}

function storeUserInformations(firstname, lastname) {
  const user = auth().currentUser
  let infos = {
    status: 'pending',
    createdAt : firestore.Timestamp.now()
  }
  if(!_.isEmpty(firstname))
    infos.firstname=firstname
  if(!_.isEmpty(lastname))
    infos.lastname=lastname

  if (user.phoneNumber) {
    infos = { ...infos, phoneNumber: user.phoneNumber }
  }
  return firestore().doc(`users/${user.uid}`).set(infos)
    .catch(error => {
      throw "Echec d'enregistrement de vos informations, réessayez plus tard ! "
    });
}

function getCurrentUser() {
  return auth().currentUser
}

function getUserId() {
  const user = auth().currentUser
  return user ? auth().currentUser.uid : undefined
}

function signIn(signInMethod, noUserInfosCallbak) {
  return async dispatch => {
    const user = auth().currentUser
    return profileService.loadUserProfile(user.uid).then(userProfile => {
      if ((!userProfile|| (!userProfile.firstname && !userProfile.lastname)) && noUserInfosCallbak)
        noUserInfosCallbak()
      else {
        dispatch(actions.signedIn(signInMethod, userProfile, user._user));
      }

    }).catch(error => {
      dispatch(actions.signedIn(signInMethod, undefined, user._user));
    })
  }
}

function facebookLogout() {
  var current_access_token = '';
  return AccessToken.getCurrentAccessToken().then((data) => {
    current_access_token = data.accessToken.toString();
  }).then(() => {
    let logout =
      new GraphRequest(
        "me/permissions/", {
          accessToken: current_access_token,
          httpMethod: 'DELETE'
        },
        (error, result) => {
          if (error) {
            console.log('Error fetching data: ' + error.toString());
          } else {
            LoginManager.logOut();
          }
        });
    new GraphRequestManager().addRequest(logout).start();
  })
    .catch(error => {
      console.log(error)
    });
}
function _signOut(signInMethod){
  thirdPartSignOut(signInMethod).then(async ()=>{
    if (auth().currentUser) {
      await auth().signOut()
    }
  })
}

async function thirdPartSignOut(signInMethod){
  switch (signInMethod) {
    case signInMethods.GOOGLE:
      await GoogleSignin.signOut()
      break;
    case signInMethods.FACEBOOK:
      await facebookLogout()
      LoginManager.logOut()
      break;
  }
}

function signOut(signInMethod) {
  return  dispatch => {
    _signOut(signInMethod)
    dispatch(actions.signedOut())
  }
}
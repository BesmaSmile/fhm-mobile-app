import { actions } from '../store/reducers/actions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import authService from './auth.service';

export default {
  updateProfile,
  updateProfilePhoto,
  loadUserProfile,
  getUserProfile,
  isEnabledAccount
}

function loadUserProfile(uid) {
  return firestore().doc(`users/${uid}`).get().then(result => {
    if (result.exists) {
      const data = result.data()
      return {
        id: result.id,
        ...data
      }
    }
    return undefined
  })
    .catch(error => {
      throw "Erreur de chargement de votre profil !"
    })
}

function getUserProfile() {
  const userId = authService.getUserId()
  return dispatch => {
    return loadUserProfile(userId).then((userProfile) => {
      dispatch(actions.loadProfile(userProfile))
      return userProfile
    }).catch(error => {
      console.log(error);
      throw "Echec de chargement de vos données, réessayez plus tard !"
    });
  }
}

async function phoneNumberExists(phoneNumber, excludedId){
  const snapshot = await firestore().collection('users')
  //.where("id", "!=", excludedId)
  .where('phoneNumber', '==', phoneNumber).get()
  return !(snapshot.empty || snapshot.docs.filter(user=>user.id!=excludedId).length==0)
}

function updateProfile(userProfile) {
  const userId = authService.getUserId()
  return async dispatch => {
    const exists=await phoneNumberExists(userProfile.phoneNumber, userId)
    if(exists)
      throw "Ce numéro de téléphone existe déja !"
    const updatedAt= firestore.Timestamp.now()
    return firestore().doc(`users/${userId}`).update({...userProfile, updatedAt}).then(() => {
      dispatch(actions.updateProfile({...userProfile,updatedAt : updatedAt.toDate() }))
    }).catch(error => {
      console.log(error);
      throw "Echec de mise à jour de votre profil, réessayez plus tard !"
    });

  }
}

function updateProfilePhoto(uri) {
  const userId = authService.getUserId()
  return dispatch => {
    const ref = storage().ref(`photosProfile/${userId}`)
    let photoURL;
    return ref.putFile(uri).then(result => ref.getDownloadURL())
      .then(ph_url => {
        photoURL=ph_url
        auth().currentUser.updateProfile({ photoURL })
      })
      .then(() => {
        dispatch(actions.updateProfilePhoto(photoURL))
      }).catch(error => {
        console.log(error);
        throw "Echec de mise à jour de votre photo de profil !"
      })
  }
}

function isEnabledAccount(){
  const userId = authService.getUserId()
  return loadUserProfile(userId).then((userProfile) => {
    return userProfile.status=='enabled'
  }).catch(error => {
    console.log(error);
    throw "Echec de chargement de vos données, réessayez plus tard !"
  });
}
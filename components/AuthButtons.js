import React, { useEffect } from 'react';
import {
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-tiny-toast'

import Icon from '../components/Icon'
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

import authService, { signInMethods } from '../services/auth.service';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import hooks from '../tools/hooks';

const AuthButtons = (props) => {

  const { screen } = props;
  const navigation = useNavigation();
  const signInRequest = hooks.useRequestState()

  useEffect(() => {
    props.setThirdPartPending(signInRequest.pending)
  }, [signInRequest.pending])

  useEffect(() => {
    if (signInRequest.error) {
      Toast.show(signInRequest.error, {
        animationDuration: 1000
      })
      setTimeout(() => {
        signInRequest.clearError()
      }, 1500)
    }
  }, [signInRequest.error])


  function _onClick(target) {
    navigation.navigate(`${target}SignIn`)
  }

  function googleSignin() {
    signInRequest.sendRequest(
      authService.googleSignIn,
      () => {
        signInRequest.sendRequest(() => { return props.signIn(signInMethods.GOOGLE) })
      }
    )
  }

  function facebookSignin() {
    signInRequest.sendRequest(
      authService.facebookSignIn,
      () => {
        //const { first_name, last_name } = user.additionalUserInfo.profile
        //authService.storeUserInformations(first_name, last_name).then(() => {
        signInRequest.sendRequest(() => { return props.signIn(signInMethods.FACEBOOK) })
        /*}).catch(error => {
          setPending(false)
          setError("Echec d'enregistrement de vos informations !")
        })*/
      }
    )
  }
  const { pending, error } = signInRequest
  return (
    <View style={styles.actions_container}>
      <TouchableHighlight style={[styles.rounded_button,
      { backgroundColor: pending ? '#8395BB' : '#3b5998' }]}
        underlayColor='#1D3261'
        disabled={pending}
        onPress={facebookSignin}>
        <Icon viewBox="0 0 32 32"
          width="32px"
          height="32px"
          name="facebook"
          fill="#ffffff" />
      </TouchableHighlight>
      <TouchableHighlight style={[styles.rounded_button, styles.google_button,
      { backgroundColor: pending ? '#eee' : '#fff' }]}
        disabled={pending}
        onPress={googleSignin}>
        <Image style={{ height: 32, width: 32 }}
          source={require('../assets/images/google.png')} />
      </TouchableHighlight>
      <TouchableHighlight style={[styles.rounded_button,
      { backgroundColor: pending ? Colors.mainColorDisabled : Colors.mainColor }]}
        underlayColor={Colors.mainColorOnPress}
        disabled={pending}
        onPress={() => _onClick('Email')}>
        <Icon viewBox="0 0 32 32"
          width="32px"
          height="32px"
          name="email"
          fill="#ffffff" />
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  actions_container: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Sizes.smallSpace,
    marginBottom: Sizes.smallSpace,

  },
  rounded_button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: Sizes.smallSpace,
    justifyContent: 'center',
    alignItems: 'center'
  },
  google_button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3
  },
})

const mapDispatchToProps = dispatch => bindActionCreators({
  signIn: authService.signIn
}, dispatch)

export default connect(() => { return {} }, mapDispatchToProps)(AuthButtons);

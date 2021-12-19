import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import BaseScreen from '../BaseScreen';
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';

import authService, { signInMethods } from '../../services/auth.service';
import hooks from '../../tools/hooks';
import { format, clean } from '../../tools/phoneNumberHandler';

const PhoneSignInScreen = (props) => {

  const [phoneNumber, setPhoneNumber] = useState()
  const [submited, setSubmited] = useState(false)
  const { sendRequest, pending, error } = hooks.useRequestState()

  useEffect(() => {
    const authUnsubscribe = auth().onAuthStateChanged(user => {
      if (user && submited) {
        props.signIn(signInMethods.PHONE)
      }
    });
    return authUnsubscribe
  }, [submited])

  const signinOnClick = () => {
    setSubmited(true)
    const cleaned = clean(phoneNumber)
    const phone = `+213${cleaned}`
    const action = () => {
      return props.phoneSignIn(phone)
    }
    const success = (conf) => {
      setTimeout(() => {
        const user = authService.getCurrentUser()
        if (!user) {
          props.navigation.replace('CodeValidation')
        }
      }, 3000)
    }
    sendRequest(action, success)
  }

  const handlePhoneNumberChange = (text) => {
    let formattedNumber = undefined
    if (text && text.length > 0) {
      formattedNumber = format(text)

    } else {
      phoneInput.clear()
    }

    setPhoneNumber(formattedNumber)
  }

  const isPhoneNumberValid = () => {
    return phoneNumber && phoneNumber.length == 12
  }

  const emailOnClick = () => {
    props.navigation.navigate('EmailSignUp')

  }

  let phoneInput;
  const signInForm = (
    <View style={styles.form_container}>
      <View style={styles.input_container}>
        <Text style={styles.country_code}>+213</Text>
        <TextInput style={styles.text_input}
          ref={input => { phoneInput = input }}
          placeholder='Téléphone'
          keyboardType={'number-pad'}
          editable={!pending}
          maxLength={12}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          onSubmitEditing={signinOnClick} />
      </View>
    </View>
  )

  const actions = (
    <TouchableHighlight style={[styles.signin_action,
    { backgroundColor: isPhoneNumberValid() ? Colors.mainColor : Colors.mainColorDisabled }]}
      underlayColor={Colors.mainColorOnPress}
      disabled={!isPhoneNumberValid()}
      onPress={signinOnClick}>
      <Text style={styles.signin_text}>Se connecter</Text>
    </TouchableHighlight>
  )

  return (
    <BaseScreen showAuthButtons={true}
      title="Connexion"
      content={signInForm}
      actions={actions}
      pending={pending}
      errorMessage={error} />
  )
}



const styles = StyleSheet.create({
  image: {
    resizeMode: 'stretch',
    position: 'absolute',
    width: "100%",
    marginTop: Sizes.mediumSpace,
    alignSelf: 'center',
    bottom: Sizes.mediumSpace + 90,
  },
  form_container: {
    flex: 2,
    justifyContent: 'center',
    marginBottom: Sizes.mediumSpace,
    marginTop: Sizes.mediumSpace
  },
  text_container: {
    marginBottom: Sizes.mediumSpace
  },
  text: {
    fontSize: Sizes.defaultTextSize
  },
  input_container: {
    flexDirection: 'row',
    height: 45,
    marginBottom: Sizes.smallSpace,
    paddingLeft: Sizes.smallSpace,
    paddingRight: Sizes.smallSpace,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 3,
  },
  country_code: {
    fontSize: Sizes.smallText,
    borderRadius: 5,
    backgroundColor: Colors.grayedColor2,
    color: '#fff',
    alignSelf: 'center',
    marginRight: 5,
    padding: 2,
    paddingLeft: 4,
    paddingRight: 4,
    textAlignVertical: 'center'
  },
  text_input: {
    fontSize: Sizes.defaultTextSize,
    flex: 1,
  },
  divider_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  divider_text: {
    margin: Sizes.mediumSpace,
    fontSize: Sizes.mediumText,
    marginBottom: -10,
  },
  divider_line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.grayedColor2
  },
  signin_action: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.mainColor,
    height: 45,
    borderRadius: 5,
    width: 200
  },
  signin_text: {
    color: Colors.lightColor,
    fontSize: Sizes.defaultTextSize
  },
  footer_text: {
    fontSize: Sizes.smallText,
  },
  link: {
    color: Colors.mainColor,
    textDecorationLine: 'underline'
  },
  pending_container: {
    margin: Sizes.mediumSpace,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const mapDispatchToProps = dispatch => bindActionCreators({
  phoneSignIn: authService.phoneSignIn,
  signIn: authService.signIn
}, dispatch)

export default connect(() => { return {} }, mapDispatchToProps)(PhoneSignInScreen);

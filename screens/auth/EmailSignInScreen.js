import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import BaseScreen from '../BaseScreen';
import Icon from '../../components/Icon'
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';
import authService, { signInMethods } from '../../services/auth.service';
import hooks from '../../tools/hooks';

const EmailSignInScreen = (props) => {

  const email = props.route.params ? props.route.params.email : undefined
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [userInfos, setUserInfos] = useState({
    email: email,
    password: undefined
  })
  const { sendRequest, pending, error, clearError } = hooks.useRequestState()
  const handleChange = (value, key) => {
    setUserInfos({
      ...userInfos,
      [key]: value
    })
  }

  const isSigninFormValid = () => {
    const { email, password } = userInfos
    return email && password && password.length > 0
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const signinOnClick = () => {
    const { email, password } = userInfos
    const action = () => {
      return authService.emailSignIn(email, password)
    }
    const success = () => {
      props.signIn(signInMethods.EMAIL)
    }
    sendRequest(action, success)
  }

  const signupOnClick = () => {
    props.navigation.replace('EmailSignUp')
  }
  const passwordInput = useRef();

  const signInForm = (
    <View style={styles.form_container}>

      <View style={styles.input_container}>
        <TextInput style={styles.text_input}
          placeholder='Email'
          autoCapitalize="none"
          keyboardType={'email-address'}
          editable={!pending}
          value={userInfos.email}
          onChangeText={(text) => handleChange(text, "email")}
          onFocus={clearError}
          onSubmitEditing={() => passwordInput.current.focus()} />
      </View>
      <View style={styles.input_container}>
        <TextInput style={styles.text_input}
          ref={passwordInput}
          placeholder='Mot de passe'
          editable={!pending}
          value={userInfos.password}
          secureTextEntry={!passwordVisible}
          onChangeText={(text) => handleChange(text, "password")}
          onFocus={clearError}
          onSubmitEditing={signinOnClick} />
        <TouchableHighlight style={styles.show_password_button}
          underlayColor={Colors.grayedColor2}
          disabled={pending}
          onPress={togglePasswordVisibility}>
          <Icon viewBox="0 0 24 24"
            width="30px"
            height="25px"
            name={passwordVisible ? "hide" : "show"}
            fill={Colors.grayedColor2} />

        </TouchableHighlight>
      </View>
      <View style={styles.signup_action}>
        <Text style={styles.signup_text}>Vous n'avez pas un compte ? </Text>
        <TouchableHighlight onPress={signupOnClick}
          disabled={pending}>
          <Text style={styles.link}>S'inscrire</Text>
        </TouchableHighlight>
      </View>
    </View>
  )

  const actions = (
    <TouchableHighlight style={styles.signin_action}
      disabled={!isSigninFormValid() || pending}
      underlayColor={Colors.mainColorOnPress}
      onPress={signinOnClick}>
      <Text style={styles.signin_text}>Se connecter</Text>
    </TouchableHighlight>
  )
  return (
    <BaseScreen showAuthButtons={false}
      title="Connexion par Email"
      content={signInForm}
      actions={actions}
      pending={pending}
      errorMessage={error} />
  )

}

const styles = StyleSheet.create({
  form_container: {
    flex: 2,
    justifyContent: 'center',
    marginBottom: Sizes.mediumSpace,
    marginTop: Sizes.mediumSpace,
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    marginBottom: Sizes.smallSpace,
    paddingLeft: Sizes.smallSpace,
    paddingRight: Sizes.smallSpace,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 3,
  },
  text_input: {
    fontSize: Sizes.defaultTextSize,
    flex: 1
  },
  show_password_button: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
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
  signup_action: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  signup_text: {
    fontSize: Sizes.smallText
  },
  link: {
    fontSize: Sizes.smallText,
    color: Colors.mainColor,
    textDecorationLine: 'underline'
  },
});

const mapDispatchToProps = dispatch => bindActionCreators({
  signIn: authService.signIn,
  signOut: authService.signOut
}, dispatch)

export default connect(() => { return {} }, mapDispatchToProps)(EmailSignInScreen);

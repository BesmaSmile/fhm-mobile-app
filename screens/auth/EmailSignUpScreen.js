import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import BaseScreen from '../BaseScreen';
import Icon from '../../components/Icon'
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';
import authService from '../../services/auth.service';
import hooks from '../../tools/hooks';

const EmailSignUpScreen = (props) => {
  const email = props.route.params ? props.route.params.email : undefined
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [userInfos, setUserInfos] = useState({
    firstname: undefined,
    lastname: undefined,
    email: undefined,
    password: undefined
  })
  const { sendRequest, pending, error } = hooks.useRequestState()

  const handleChange = (value, key) => {
    setUserInfos({
      ...userInfos,
      [key]: value
    })
  }

  const isSignupFormValid = () => {
    const { email, password } = userInfos
    return email && password && password.length > 0
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const signupOnClick = () => {
    const { email, password, firstname, lastname } = userInfos
    const action = () => {
      return authService.emailSignUp(email, password, firstname, lastname)
    }
    const success = () => {
      props.navigation.replace("EmailVerification", { email: email })
      //props.signOut();
    }
    sendRequest(action, success)
  }

  const signinOnClick = () => {
    props.navigation.replace('EmailSignIn')
  }
  const firstnameInput = useRef(), emailInput = useRef(), passwordInput = useRef();
  const signUpForm = (
    <View style={styles.form_container}>
      <View style={styles.input_container}>
        <TextInput style={styles.text_input}
          placeholder='Nom'
          maxLength={20}
          editable={!pending}
          value={userInfos.lastname}
          onChangeText={(text) => handleChange(text, "lastname")}
          onSubmitEditing={() => firstnameInput.current.focus()} />
      </View>
      <View style={styles.input_container}>
        <TextInput style={styles.text_input}
          ref={firstnameInput}
          placeholder='Prénom'
          maxLength={20}
          editable={!pending}
          value={userInfos.firstname}
          onChangeText={(text) => handleChange(text, "firstname")}
          onSubmitEditing={() => emailInput.current.focus()} />
      </View>
      <View style={styles.input_container}>
        <TextInput style={styles.text_input}
          ref={emailInput}
          placeholder='Email'
          autoCapitalize="none"
          keyboardType={'email-address'}
          editable={!pending}
          value={userInfos.email}
          onChangeText={(text) => handleChange(text, "email")}
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
          onSubmitEditing={signupOnClick} />
        <TouchableHighlight style={styles.show_password_button}
          underlayColor={Colors.grayedColor2}
          disabled={pending}
          onPress={togglePasswordVisibility}>
          <Icon viewBox="0 0 24 24"
            width="30px"
            height="25px"
            name={passwordVisible ? "hide" : "show"}
            fill={Colors.secondColor} />

        </TouchableHighlight>
      </View>
      <View style={styles.signin_action}>
        <Text style={styles.signin_text}>Vous ête membre ? </Text>
        <TouchableHighlight onPress={signinOnClick}
          disabled={pending}>
          <Text style={styles.link}>Se connecter</Text>
        </TouchableHighlight>
      </View>
    </View>
  )

  const actions = (
    <TouchableHighlight style={styles.signup_action}
      disabled={!isSignupFormValid() || pending}
      underlayColor={Colors.mainColorOnPress}
      onPress={signupOnClick}>
      <Text style={styles.signup_text}>S'inscrire</Text>
    </TouchableHighlight>

  )

  return (
    <BaseScreen showAuthButtons={false}
      title="Inscription"
      content={signUpForm}
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
    marginTop: Sizes.mediumSpace
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
  signup_action: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.mainColor,
    height: 45,
    borderRadius: 5,
    width: 200
  },
  signup_text: {
    color: Colors.lightColor,
    fontSize: Sizes.mediumText
  },
  signin_action: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

  },
  signin_text: {
    fontSize: Sizes.smallTe
  },
  link: {
    fontSize: Sizes.smallText,
    color: Colors.mainColor,
    textDecorationLine: 'underline'
  }
});

const mapDispatchToProps = dispatch => bindActionCreators({
  signOut: authService.signOut
}, dispatch)

export default connect(() => { return {} }, mapDispatchToProps)(EmailSignUpScreen);

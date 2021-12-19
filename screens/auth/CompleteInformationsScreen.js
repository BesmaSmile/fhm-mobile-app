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
import authService, {signInMethods}  from '../../services/auth.service';
import hooks from '../../tools/hooks';

const CompleteInformationsScreen=(props)=> {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [userInfos, setUserInfos] = useState({
    firstname: undefined,
    lastname: undefined
  })

  const {sendRequest, pending, error}=hooks.useRequestState()

  const handleChange=(value, key)=> {
    setUserInfos({
      ...userInfos,
      [key]: value
    })
  }

  const isFormValid=()=> {
    const { firstname, lastname } = userInfos
    return firstname && lastname
  }

  const isPasswordMatched=()=> {
    const { password, confirmPassword } = userInfos
    return password && confirmPassword && password === confirmPassword
  }

  const togglePasswordVisibility=()=> {
    setPasswordVisible(!passwordVisible)

  }

   const continueOnClick=()=> {
    const { firstname, lastname } = userInfos
    const action=()=>{
      return authService.storeUserInformations(firstname || '', lastname ||'')
    }
    const success=()=>{
      props.signIn(signInMethods.PHONE)
    }
    sendRequest(action, success)
  }

  const laterOnClick=()=> {
    props.signIn(signInMethods.PHONE)
  }

  const firstnameInput=useRef();

  const form = (
    <View style={styles.main_container}>
      <View style={styles.form_container}>
        <View style={styles.input_container}>
          <TextInput style={styles.text_input}
            placeholder='Nom'
            maxLength={20}
            editable={!pending}
            value={userInfos.lastname}
            onChangeText={(text) => handleChange(text, 'lastname')}
            onSubmitEditing={() => firstnameInput.current.focus()} />
        </View>
        <View style={styles.input_container}>
          <TextInput style={styles.text_input}
            ref={firstnameInput}
            placeholder='Prénom'
            maxLength={20}
            editable={!pending}
            value={userInfos.firstname}
            onChangeText={(text) => handleChange(text, 'firstname')}
            onSubmitEditing={continueOnClick} />
        </View>
      </View>
    </View>
  )
  const actions = (
    <>
      <TouchableHighlight style={[styles.continue_action, { marginBottom: Sizes.smallSpace },
      { backgroundColor: (!isFormValid() || pending) ? Colors.mainColorDisabled : Colors.mainColor }]}
        disabled={!isFormValid() || pending}
        underlayColor={Colors.mainColorOnPress}
        onPress={continueOnClick}>
        <Text style={styles.continue_text}>Enregistrer</Text>
      </TouchableHighlight>
      <TouchableHighlight style={[styles.continue_action,
      { backgroundColor: pending ? '#eee' : Colors.grayedColor1 }]}
        disabled={pending}
        underlayColor={Colors.mainColorOnPress}
        onPress={continueOnClick}>
        <Text style={styles.later_text}>Plus tard</Text>
      </TouchableHighlight>
    </>
  )
  return (
    <BaseScreen showAuthButtons={false}
      title="Informations"
      content={form}
      actions={actions}
      pending={pending}
      errorMessage={error} />
  )
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  content_container: {
    flex: 4,
    marginTop: Sizes.mediumSpace
  },
  form_container: {
    flex: 2,
    justifyContent: 'center',
    marginBottom: Sizes.mediumSpace,
    marginTop: Sizes.mediumSpace
  },
  input_container: {
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
  continue_action: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.mainColor,
    height: 45,
    borderRadius: 5,
    width: 200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  later_action: {

  },
  continue_text: {
    color: Colors.lightColor,
    fontSize: Sizes.defaultTextSize
  },
  later_text: {
    color: Colors.mainColor,
    fontSize: Sizes.defaultTextSize
  }

});

const mapDispatchToProps = dispatch => bindActionCreators({
  signIn: authService.signIn
}, dispatch)

export default connect(() => { return {} }, mapDispatchToProps)(CompleteInformationsScreen);

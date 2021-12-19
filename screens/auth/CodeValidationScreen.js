import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getConfirmationResult } from '../../store/reducers/accountReducer';
import auth from '@react-native-firebase/auth';

import BaseScreen from '../BaseScreen';
import Icon from '../../components/Icon'
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';
import authService, { signInMethods } from '../../services/auth.service';
import profileService from '../../services/auth.service';
import hooks from '../../tools/hooks';

const CodeValidationScreen = (props) => {
  let codeInputs = []
  const [code, setCode] = useState([undefined, undefined, undefined, undefined, undefined, undefined])
  const [submitted, setSubmitted] = useState(false)
  const [isValid, setValid] = useState(true)
  const [isAutomaticallyVerified, setAutomaticallyVerified] = useState(true)

  const { sendRequest, pending, error } = hooks.useRequestState()

  useEffect(() => {

    const authUnsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setValid(true)
        setTimeout(() => {
          props.signIn(signInMethods.PHONE, () => {
            props.navigation.replace('CompleteInformations')
          })
        }, 2000)

      }
    });
    return authUnsubscribe
  }, [])

  const handleCodeChange = (value, index) => {
    const cleaned = value.replace(/\D/g, '')
    setCode(updateCode(index, cleaned))
    if (cleaned.length == 1 && index != 5) codeInputs[index + 1].focus();
  }

  const updateCode = (index, value) => {
    return code.map((item, i) => index === i ? value : item);
  }

  const isFormValid = () => {
    return code.every(element => element && element.length == 1)
  }

  const sendOnClick = async () => {
    setAutomaticallyVerified(false)
    const action = () => {
      return props.confirmation.confirm(code.join(""))
        .catch(error => {
          console.log(error);
          let message = ""
          let isValid = true
          switch (error.code) {
            case "auth/invalid-verification-code":
              message = "Code de vérification invalide"
              isValid = false
              break;
            case "auth/session-expired":
              message = "Le code de validation a expiré ! Veuillez renvoyer le code de validation"
              isValid = false
              break;
            default:
              message = "Echec de vérification !"
              break;
          }

          setValid(isValid)
          throw message
        });
    }
    const success = (user) => {
      setSubmitted(true)
    }
    sendRequest(action, success)

  }
  const inputBorderStyle =
    submitted && isValid ? {
      borderColor: Colors.greenColor,
    }
      : (!isValid && !pending ? {
        borderColor: 'orange',
      }
        : {
          borderColor: '#eee',
        })

  const form = (
    <View style={styles.form_container}>
      {submitted && isValid && isAutomaticallyVerified &&
        <View style={styles.text_container}>
          <Text style={styles.validated_text}>Code vérifié automatiquement!</Text>
        </View>
      }
      {(!submitted || !isAutomaticallyVerified) &&
        <>
          <View style={styles.text_container}>
            <Text style={styles.text}>Un code de 6 chiffres à été envoyé à votre numéro</Text>
          </View>
          <View style={styles.input_container}>
            <TextInput style={[styles.text_input, styles.margin_input, inputBorderStyle]}
              keyboardType={'number-pad'}
              maxLength={1}
              ref={(input) => { codeInputs[0] = input; }}
              value={code[0]}
              onChangeText={(value) => handleCodeChange(value, 0)} />
            <TextInput style={[styles.text_input, styles.margin_input, inputBorderStyle]}
              keyboardType={'number-pad'}
              maxLength={1}
              ref={(input) => { codeInputs[1] = input; }}
              value={code[1]}
              onChangeText={(value) => handleCodeChange(value, 1)} />
            <TextInput style={[styles.text_input, styles.margin_input, inputBorderStyle]}
              keyboardType={'number-pad'}
              maxLength={1}
              ref={(input) => { codeInputs[2] = input; }}
              value={code[2]}
              onChangeText={(value) => handleCodeChange(value, 2)} />
            <TextInput style={[styles.text_input, styles.margin_input, inputBorderStyle]}
              keyboardType={'number-pad'}
              maxLength={1}
              ref={(input) => { codeInputs[3] = input; }}
              value={code[3]}
              onChangeText={(value) => handleCodeChange(value, 3)} />
            <TextInput style={[styles.text_input, styles.margin_input, inputBorderStyle]}
              keyboardType={'number-pad'}
              maxLength={1}
              ref={(input) => { codeInputs[4] = input; }}
              value={code[4]}
              onChangeText={(value) => handleCodeChange(value, 4)} />
            <TextInput style={[styles.text_input, inputBorderStyle]}
              keyboardType={'number-pad'}
              maxLength={1}
              ref={(input) => { codeInputs[5] = input; }}
              value={code[5]}
              onChangeText={(value) => handleCodeChange(value, 5)}
              onSubmitEditing={sendOnClick} />
          </View>
        </>
      }

      {submitted && isValid &&
        <View style={styles.validated_code_container}>
          <View style={styles.validated_code}><Icon viewBox="0 0 32 32"
            width="25px"
            height="25px"
            name="correct"
            fill={Colors.greenColor} />
          </View>
        </View>
      }
    </View>
  )
  const actions = (
    <View>
      <TouchableHighlight style={[styles.send_action,
      { backgroundColor: isFormValid() ? Colors.mainColor : Colors.mainColorDisabled }]}
        underlayColor={Colors.mainColorOnPress}
        disabled={!isFormValid() || (submitted && isValid)}
        onPress={sendOnClick}>
        <Text style={styles.send_text}>Envoyer</Text>
      </TouchableHighlight>
      <View style={styles.resend_code}><Text style={styles.link}>Renvoyer un code</Text></View>
    </View>
  )

  return (
    <BaseScreen showAuthButtons={false}
      title="Vérification téléphone"
      content={form}
      actions={actions}
      pending={pending}
      errorMessage={error} />

  )
}

const styles = StyleSheet.create({
  form_container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: Sizes.mediumSpace,
    marginTop: Sizes.mediumSpace
  },
  text_container: {
    marginBottom: Sizes.largSpace,
  },
  validated_text: {
    fontSize: Sizes.defaultTextSize,
    color: Colors.greenColor,
    textAlign: 'center'
  },
  text: {
    fontSize: Sizes.smallText,
    textAlign: 'center'
  },
  input_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 42,
    marginBottom: Sizes.smallSpace,
  },
  text_input: {
    flex: 1,
    backgroundColor: '#fff',
    fontSize: Sizes.defaultTextSize,
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#eee',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  margin_input: {
    marginRight: Sizes.smallSpace
  },
  send_action: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.mainColor,
    height: 45,
    borderRadius: 5,
    width: 200
  },
  send_text: {
    color: Colors.lightColor,
    fontSize: Sizes.defaultTextSize
  },
  link: {
    fontSize: Sizes.smallText,
    color: Colors.mainColor,
    textDecorationLine: 'underline'
  },
  resend_code: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  validated_code_container: {
    margin: Sizes.mediumSpace,
    justifyContent: 'center',
    alignItems: 'center',
  },
  validated_code: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.greenColor
  },

})

const mapStateToProps = state => ({
  confirmation: getConfirmationResult(state.account),
})

const mapDispatchToProps = dispatch => bindActionCreators({
  signIn: authService.signIn,
  signOut: authService.signOut
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CodeValidationScreen);

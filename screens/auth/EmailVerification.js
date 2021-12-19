import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import BaseScreen from '../BaseScreen';
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';

const EmailVerification = (props) => {

  const signinOnClick = () => {
    const { email } = props.route.params
    props.navigation.replace('EmailSignIn', { email: email })
  }
  const { email } = props.route.params
  const emailVerificationContent = (
    <View style={styles.content}>
      <Text style={styles.text}>Nous venons de vous envoyer un mail de confirmation à l'adresse : </Text>
      <Text style={[styles.text, styles.email_text]}>{email}</Text>
      <Text style={styles.text}>Nous avons besoin de vérifier que l'adresse mail vous appartient </Text>
      <Text style={styles.text}>Veuillez consulter votre email et suivre les instruction. </Text>
    </View>
  )
  const actions = (
    <TouchableHighlight style={styles.signin_action}
      underlayColor={Colors.mainColorOnPress}
      onPress={signinOnClick}>
      <Text style={styles.signin_text}>Se connecter</Text>
    </TouchableHighlight>
  )
  return (
    <BaseScreen showAuthButtons={false}
      title="Confirmer votre email"
      content={emailVerificationContent}
      actions={actions} />
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 2,
    justifyContent: 'space-between',
    marginBottom: Sizes.mediumSpace,
    marginTop: Sizes.mediumSpace
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
  text: {
    fontSize: Sizes.defaultTextSize,
    color: Colors.darkColor,
    marginTop: Sizes.smallSpace,
    marginBottom: Sizes.smallSpace,
  },
  email_text: {
    fontWeight: 'bold',
    fontSize: Sizes.mediumText,
    alignSelf: 'center'
  }
})
export default EmailVerification

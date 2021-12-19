import React from 'react';
import {
  ImageBackground,
  StyleSheet
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import PhoneSignInScreen from '../screens/auth/PhoneSignInScreen';
import CodeValidationScreen from '../screens/auth/CodeValidationScreen';
import EmailSignUpScreen from '../screens/auth/EmailSignUpScreen';
import EmailVerification from '../screens/auth/EmailVerification';
import EmailSignInScreen from '../screens/auth/EmailSignInScreen';
import CompleteInformationsScreen from '../screens/auth/CompleteInformationsScreen';

const Stack = createStackNavigator();

const AuthStack = () => {

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.image}>
      <Stack.Navigator initialRouteName='PhoneSignIn' screenOptions={{ headerShown: false, cardStyle: styles.card_style }}>

        <Stack.Screen name="PhoneSignIn" component={PhoneSignInScreen} />
        <Stack.Screen name="CodeValidation" component={CodeValidationScreen} />
        <Stack.Screen name="CompleteInformations" component={CompleteInformationsScreen} />

        <Stack.Screen name="EmailSignUp" component={EmailSignUpScreen} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        <Stack.Screen name="EmailSignIn" component={EmailSignInScreen} />

      </Stack.Navigator>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%"
  },
  card_style: {
    backgroundColor: 'transparent'
  }
})

export default AuthStack

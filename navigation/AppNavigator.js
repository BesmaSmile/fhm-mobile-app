import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux'

import CheckAuthScreen from '../screens/CheckAuthScreen';
import AuthStack from './AuthStack';
import AppDrawer from './AppDrawer';

import { getUserAccount, isLoadingAccount, signInMethod } from '../store/reducers/accountReducer';

const Stack = createStackNavigator();

const AppNavigator = (props) => {
  const { userAccount, isLoadingAccount } = props
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {
          isLoadingAccount ? <Stack.Screen name="Loading" component={CheckAuthScreen} />
            : (userAccount ? <Stack.Screen name="App" component={AppDrawer} />
              : <Stack.Screen name="Auth" component={AuthStack} />
            )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const mapStateToProps = state => ({
  userAccount: getUserAccount(state.account),
  signInMethod: signInMethod(state.account),
  isLoadingAccount: isLoadingAccount(state.account)
})

export default connect(mapStateToProps)(AppNavigator);

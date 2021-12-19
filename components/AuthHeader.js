import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import Icon from '../components/Icon'
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

const AuthHeader = () => {
  return (
    <View style={styles.header_container}>

      <Text style={styles.header_text}>Forever</Text>
      <Icon style={styles.header_logo} viewBox="0 0 29 30"
        width="50px"
        height="60px"
        name="logo"
        fill={Colors.mainColor} />
    </View>
  )
}

const styles = StyleSheet.create({
  header_container: {
    height: 65,
    marginTop: Sizes.smallSpace,
    marginBottom: Sizes.smallSpace,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  header_text: {
    fontSize: Sizes.hugeText,
    fontFamily: 'Cochin',
    color: Colors.defaultTextColor
  },
  header_logo: {
    marginBottom: 5
  },
});

export default AuthHeader;

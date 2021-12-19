import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import Colors from '../../constants/Colors';

//A propos
function SupportScreen() {
  return (
    <View style={styles.main_container}>
      <Text>A props</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor
  }
})

export default SupportScreen;

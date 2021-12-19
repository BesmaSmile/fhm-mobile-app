import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import Icon from './Icon'
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

const Response = ({ text, subText, action, icon, onClick }) => {
  return (
    <View style={styles.response_container}>
      <Icon viewBox="0 0 32 32"
        width="70px"
        height="70px"
        name={icon}
        fill={Colors.grayedColor2} />
      <Text style={styles.response_message}>{text}</Text>
      <Text style={styles.response_indication}>{subText}</Text>
      {action &&
        <TouchableHighlight style={styles.button}
          underlayColor={Colors.mainColorOnPress}
          onPress={onClick}>
          <Text style={styles.button_text}>{action}</Text>
        </TouchableHighlight>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  response_container: {
    flex: 1,
    padding: Sizes.mediumSpace,
    justifyContent: 'center',
    alignItems: 'center'
  },
  response_message: {
    marginBottom: Sizes.smallSpace,
    marginTop: 50,
    color: Colors.darkColor,
    fontSize: Sizes.defaultTextSize,
    textAlign: 'center',
  },
  response_indication: {
    marginBottom: 50,
    textAlign: 'center',
    color: Colors.grayedColor2,
    fontSize: Sizes.smallText,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.mainColor,
    height: 45,
    borderRadius: 5,
    marginTop: Sizes.smallSpace,
    width: 200
  },
  button_text: {
    fontSize: Sizes.defaultTextSize,
    color: '#fff'
  },
})

export default Response;

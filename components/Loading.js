import React from 'react';
import { UIActivityIndicator } from 'react-native-indicators';
import Colors from '../constants/Colors';

const Loading=({ size }) =>{
  return (
    <UIActivityIndicator size={size} color={Colors.mainColor} />
  )
}

export default Loading;

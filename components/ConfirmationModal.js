import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';

import Loading from '../components/Loading';
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

const ConfirmationModal = (props) => {
  const { visible, pending, title, message, actions } = props
  return (
    <Modal isVisible={visible || pending}>
      <View style={styles.modal_container}>
        <Text style={styles.modal_title}>{title}</Text>
        <View style={styles.modal_content}>
          {!pending && <Text style={styles.modal_text}>{message}</Text>}
          {pending && <Loading />}
        </View>

        <View style={styles.modal_actions}>
          {actions}
        </View>
      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({
  modal_container: {
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: Sizes.mediumSpace,
    overflow: 'hidden'
  },
  modal_title: {
    margin: Sizes.mediumSpace,
    marginBottom: 0,
    fontWeight: 'bold',
    fontSize: Sizes.defaultTextSize
  },
  modal_content: {
    margin: Sizes.mediumSpace,
    minHeight: 50
  },
  modal_text: {
    fontSize: Sizes.defaultTextSize,
    lineHeight: 25
  },
  modal_actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee'
  },
})

export default ConfirmationModal;

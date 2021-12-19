import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  //Linking
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Toast from 'react-native-tiny-toast'

import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getConfirmDeliveryError, isConfirmDeliveryPending } from '../../store/reducers/purchaseReducer';
import ordersService from '../../services/orders.service';

const ScanQRCodeScreen = (props) => {
  const { order } = props.route.params
  const onSuccess = e => {
    if (order.id == e.data) {
      props.confirmDelivery(order, () => {
        Toast.show("Livraison de la commande confirmée !", {
          containerStyle: { margin: Sizes.smallSpace, backgroundColor: Colors.greenColor },
          textStyle: { color: '#fff' },
          animationDuration: 1000
        })
        setTimeout(() => {
          props.navigation.goBack()
        }, 1000)

      })
    } else {
      Toast.show("le code QR ne correspond pas à cette commande !", {
        containerStyle: { margin: Sizes.smallSpace, backgroundColor: Colors.yellowColor },
        textStyle: { color: '#fff' },
        animationDuration: 1000
      })
    }
  };


  useEffect(() => {
    if (props.error) {
      Toast.show(props.error, {
        animationDuration: 1000
      })
    }
  }, [props.error])

  return (
    <QRCodeScanner
      onRead={onSuccess}
      reactivate={true}
      reactivateTimeout={2000}
      fadeIn={false}
      markerStyle={{ borderColor: Colors.grayedColor2 }}
      cameraProps={{ style: { height: "70%", overflow: 'hidden' } }}
      showMarker={true}
      topContent={
        <Text style={styles.title}>
          Veuillez scanner le code QR du bon de réception
        </Text>
      }
      bottomContent={
        <Text style={styles.message}>
          En scannant le code QR vous confirmez la réception votre commande !
        </Text>
      }
    />
  )
}


const styles = StyleSheet.create({
  title: {
    fontSize: Sizes.defaultTextSize,
    padding: Sizes.mediumSpace,
    color: Colors.grayedColor2
  },
  message: {
    padding: Sizes.mediumSpace,
    fontSize: Sizes.smallText,
    color: Colors.redColor
  },
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  confirmDelivery: ordersService.confirmDelivery
}, dispatch)

const mapStateToProps = (state) => ({
  error: getConfirmDeliveryError(state.purchase),
  pending: isConfirmDeliveryPending(state.purchase)
})

export default connect(mapStateToProps, mapDispatchToProps)(ScanQRCodeScreen)

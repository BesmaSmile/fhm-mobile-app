import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  FlatList
} from 'react-native';
import Toast from 'react-native-tiny-toast'

import firestore from '@react-native-firebase/firestore';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import {
  getShoppingCart, getOrders, isLoadingShoppingCart, getLoadingShoppingCartError, getUpdateError,
  getClearError, isClearPending, getValidateError, isValidatePending, getProductsCatalog
} from '../../store/reducers/purchaseReducer';
import { getUserProfile } from '../../store/reducers/accountReducer'
import shoppingCartService from '../../services/shoppingCart.service';
import catalogService from '../../services/catalog.service';
import ordersService from '../../services/orders.service';
import profileService from '../../services/profile.service';

import { ShoppingCartProductCard } from '../../components/ProductCard';
import ConfirmationModal from '../../components/ConfirmationModal';
import Response from '../../components/Response';
import Loading from '../../components/Loading';
import Icon from '../../components/Icon'
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';
import { format } from 'date-fns';
import _ from 'lodash';

//Mon panier
const ShoppingCartScreen = (props) => {
  const { shoppingCart, getShoppingCart, clearShoppingCart, userProfile,
    validateOrder, isValidatePending, isClearPending, isLoadingShoppingCart, loadingShoppingCartError } = props
  const [state, setState] = useState({
    isClearShoppingCartModalVisible: false,
    isCompleteInformationsModalVisible: false,
    isActivateAccountModalVisible: false,
    isValidateOrderModalVisible: false,
    isCantOrderModalVisible : false
  })

  useEffect(() => {
    _loadShoppingCart()
  }, [])

  useEffect(() => {
    if (props.updateError) {
      Toast.show(props.updateError, {
        animationDuration: 1000
      })
    }
    if (props.clearError) {
      Toast.show(clearError, {
        animationDuration: 1000
      })
    }
    if (props.validateError) {
      Toast.show(validateError, {
        animationDuration: 1000
      })
    }
  }, [props.updateError, props.clearError, props.validateError])

  const _loadShoppingCart = () => {
    if (!shoppingCart)
      getShoppingCart()
  }

  const _calculateTotal = () => {
    const total = shoppingCart.reduce((article1, article2) => ({
      price: (article1.imported ? article1.importationPrice : article1.price) * article1.quantity
        + (article2.imported ? article2.importationPrice : article2.price) * article2.quantity,
      quantity: 1
    }), { price: 0, quantity: 0 })
    return total.price
  }

  const _startOnClick = () => {
    props.navigation.navigate('HomeStack')
  }

  const _clearOnClick = () => {
    setState({
      ...state,
      isClearShoppingCartModalVisible: true
    })
  }
  const canOrder=()=>{
    const now=firestore.Timestamp.now().toDate()
    const currentDayOrders=_.get(props, 'orders', [])
    .filter(order=>format(order.createdAt, 'dd/MM/yyyy')
    ==format(now, 'dd/MM/yyyy'))
    return true || (currentDayOrders.length==0 &&  now.getHours()<4) 
    || (!currentDayOrders.some(order=>order.createdAt.getHours()>=12) && now.getHours()>=12)
  }

  // pas de commande pour aujourdhui et on est avant 4h
  // il y a des commande d'aujourdhui mais aucune n'est après 12h et l'heur est >12
  const _validateOnClick = async () => {
    const completedInformations =
      userProfile &&
      userProfile.firstname
      && userProfile.lastname
      && userProfile.phoneNumber
      && userProfile.restaurant
    _.get(userProfile, 'address.location') &&
      _.get(userProfile, 'address.province') &&
      _.get(userProfile, 'address.municipality')
    if (!completedInformations) {
      setState({
        ...state,
        isCompleteInformationsModalVisible: true
      })
    }
    else {
      const enabled = await profileService.isEnabledAccount()
      if (!enabled) {
        setState({
          ...state,
          isActivateAccountModalVisible: true
        })
      }
      else {
        if(!canOrder()){
          setState({
            ...state,
            isCantOrderModalVisible: true
          })
        }else
          setState({
            ...state,
            isValidateOrderModalVisible: true
          })
      }
    }
  }

  const _clearShoppingCart = () => {
    clearShoppingCart()
    setState({
      ...state,
      isClearShoppingCartModalVisible: false
    })
  }

  const _validateOrder = () => {
    const order = {
      createdAt: firestore.Timestamp.now(),
      articles: shoppingCart.map(article => (article.imported ?
        {
          id: article.id,
          quantity: article.quantity,
          imported: true,
        } : {
          id: article.id,
          quantity: article.quantity
        }
      )),
      status : 'pending'
    }
    validateOrder(order, () => {
      Toast.show("Votre commande a été envoyée !", {
        containerStyle: { backgroundColor: Colors.greenColor },
        textStyle: { color: '#fff' },
        animationDuration: 1000
      })
      setTimeout(() => {
        props.navigation.navigate('Orders')
      }, 1000)

    })
    setState({
      ...state,
      isValidateOrderModalVisible: false
    })
  }

  const _hideClearShoppingCartModalModal = () => {
    setState({
      ...state,
      isClearShoppingCartModalVisible: false
    })
  }

  const _hideValidateOrderModal = () => {
    setState({
      ...state,
      isValidateOrderModalVisible: false
    })
  }

  const _hideCompleteInformationsModal = () => {
    setState({
      ...state,
      isCompleteInformationsModalVisible: false
    })
  }

  const _hideActivateAccountModal = () => {
    setState({
      ...state,
      isActivateAccountModalVisible: false
    })
  }

  const _hideCantOrderModal=()=>{
    setState({
      ...state,
      isCantOrderModalVisible: false
    })
  }
  const validationModal = () => {
    const validateOrderActions = (
      <>
        <TouchableHighlight style={styles.modal_button}
          underlayColor={Colors.grayedColor1}
          onPress={_hideValidateOrderModal}
          disabled={isValidatePending}>
          <Text style={[styles.button_text, { color: isValidatePending ? Colors.mainColorDisabled : Colors.mainColor }]}>Annuler</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.modal_button}
          underlayColor={Colors.grayedColor1}
          onPress={_validateOrder}
          disabled={isValidatePending}>
          <Text style={[styles.button_text, { fontWeight: 'bold', color: isValidatePending ? Colors.mainColorDisabled : Colors.mainColor }]}>Oui</Text>
        </TouchableHighlight>
      </>
    )
    return <ConfirmationModal
      title="Finaliser ma commande"
      message="Etes vous sûr de vouloir finaliser votre commande ?"
      actions={validateOrderActions}
      pending={isValidatePending}
      visible={state.isValidateOrderModalVisible}
    />
  }

  const clearShoppingCartModal = () => {
    const clearShoppingCartActions = (
      <>
        <TouchableHighlight style={styles.modal_button}
          underlayColor={Colors.grayedColor1}
          onPress={_hideClearShoppingCartModalModal}
          disabled={isClearPending}>
          <Text style={[styles.button_text, { color: isClearPending ? Colors.mainColorDisabled : Colors.mainColor }]}>Annuler</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.modal_button}
          underlayColor={Colors.grayedColor1}
          onPress={_clearShoppingCart}
          disabled={isClearPending}>
          <Text style={[styles.button_text, { fontWeight: 'bold', color: isClearPending ? Colors.mainColorDisabled : Colors.mainColor }]}>Oui</Text>
        </TouchableHighlight>
      </>
    )
    return (
      <ConfirmationModal
        title="Vider le panier"
        message="Etes vous sûr de vouloir vider le panier ?"
        actions={clearShoppingCartActions}
        pending={isClearPending}
        visible={state.isClearShoppingCartModalVisible}
      />
    )
  }

  const completeInformationsModal = () => {

    const completedInformationsActions = (
      <>
        <TouchableHighlight style={styles.modal_button}
          underlayColor={Colors.grayedColor1}
          onPress={_hideCompleteInformationsModal}>
          <Text style={[styles.button_text, { color: Colors.mainColor }]}>Annuler</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.modal_button}
          underlayColor={Colors.grayedColor1}
          onPress={_redirectToCompeteInformations}>
          <Text style={[styles.button_text, { fontWeight: 'bold', color: Colors.mainColor }]}>Ok</Text>
        </TouchableHighlight>
      </>
    )
    return (
      <ConfirmationModal
        title="Compléter vos informations"
        message="Veuillez compléter vos informations et demander à l'équipe FHM l'activation de votre compte avant de pouvoir continuer !"
        actions={completedInformationsActions}
        visible={state.isCompleteInformationsModalVisible}
      />
    )
  }

  const _redirectToCompeteInformations = () => {
    setState({
      ...state,
      isCompleteInformationsModalVisible: false
    })
    props.navigation.navigate('Account')
  }

  const activateAccountModal = () => {

    const activateAccountActions = (
      <TouchableHighlight style={styles.modal_button}
        underlayColor={Colors.grayedColor1}
        onPress={_hideActivateAccountModal}>
        <Text style={[styles.button_text, { fontWeight: 'bold', color: Colors.mainColor }]}>Ok</Text>
      </TouchableHighlight>
    )
    return (
      <ConfirmationModal
        title="Activer votre compte"
        message="Veuillez demander à l'équipe FHM l'activation de votre compte avant de pouvoir continuer !"
        actions={activateAccountActions}
        visible={state.isActivateAccountModalVisible}
      />
    )
  }

  const cantOrderModal = () => {

    const cantOrderActions = (
      <TouchableHighlight style={styles.modal_button}
        underlayColor={Colors.grayedColor1}
        onPress={_hideCantOrderModal}>
        <Text style={[styles.button_text, { fontWeight: 'bold', color: Colors.mainColor }]}>Ok</Text>
      </TouchableHighlight>
    )
    return (
      <ConfirmationModal
        title="Commandes suspendues"
        message="Vous pouvez faire une seule commande entre 12h et 4h du lendemain matin !"
        actions={cantOrderActions}
        visible={state.isCantOrderModalVisible}
      />
    )
  }

  const Header = () => {
    return (
      <View style={styles.header_container}>
        <View style={styles.total_container}>
          <Text style={styles.total_text}>Prix total ({shoppingCart.length} articles) : </Text>
          <Text style={styles.total_value}>{_calculateTotal()} DZA</Text>
        </View>
        <TouchableHighlight style={[styles.button, { backgroundColor: Colors.mainColor, }]}
          underlayColor={Colors.mainColorOnPress}
          onPress={_validateOnClick}>
          <Text style={[styles.button_text, { color: '#fff' }]}>Finaliser ma commande</Text>
        </TouchableHighlight>
        <TouchableHighlight style={[styles.button, { backgroundColor: Colors.grayedColor1 }]}
          underlayColor={Colors.grayedColor1}
          onPress={_clearOnClick}>
          <Text style={[styles.button_text, { color: Colors.darkColor }]}>Vider le panier</Text>
        </TouchableHighlight>

      </View>
    )
  }



  return (

    <View style={styles.main_container}>

      {clearShoppingCartModal()}
      {validationModal()}
      {completeInformationsModal()}
      {activateAccountModal()}
      {cantOrderModal()}

      {!shoppingCart && isLoadingShoppingCart &&
        <Loading />
      }
      {!shoppingCart && loadingShoppingCartError &&
        <Response text={loadingShoppingCartError}
          subText="Vérifiez votre connexion et réessayez"
          icon='error'
          action="Réessayez"
          onClick={() => _loadShoppingCart()}
        />
      }

      {shoppingCart && shoppingCart.length > 0 &&
        <>
          <Header />
          <FlatList data={shoppingCart}
            renderItem={({ item }) => <ShoppingCartProductCard {...item}
              displayMode='list' />}
            getItemLayout={(data, index) => ({ length: 100, offset: 100 * index, index })}
            keyExtractor={item => item.id}
          />
        </>
      }
      {shoppingCart && shoppingCart.length == 0 &&
        <Response text="Votre panier est vide"
          subText="Commencer à le remplir !"
          icon='shoppingCart'
          action="Commencer"
          onClick={_startOnClick}
        />
      }
    </View>
  )
}


const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  start_button: {
    width: 200
  },
  header_container: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
    padding: Sizes.mediumSpace
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 5,
    marginTop: Sizes.smallSpace,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  button_text: {
    fontSize: Sizes.defaultTextSize,
  },
  total_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  total_text: {
    fontSize: Sizes.defaultTextSize,
    color: Colors.darkColor
  },
  total_value: {
    fontSize: Sizes.mediumText,
    color: Colors.blueColor,
    fontWeight: 'bold',
    marginLeft: Sizes.smallSpace
  },
  response_message: {
    margin: Sizes.smallSpace,
    marginTop: 50,
    color: Colors.darkColor,
    fontSize: Sizes.mediumText,
  },
  response_indication: {
    marginBottom: 50,
    color: Colors.grayedColor2,
    fontSize: Sizes.smallText,
  },
  modal_button: {
    flex: 1,
    padding: Sizes.smallSpace,
    justifyContent: 'center',
    alignItems: 'center',
  },

})

const mapStateToProps = (state, props) => ({
  userProfile: getUserProfile(state.account),
  shoppingCart: getShoppingCart(state.purchase),
  orders: getOrders(state.purchase),
  updateError: getUpdateError(state.purchase),
  productsCatalog: getProductsCatalog(state.purchase),

  isLoadingShoppingCart: isLoadingShoppingCart(state.purchase),
  loadingShoppingCartError: getLoadingShoppingCartError(state.purchase),

  isClearPending: isClearPending(state.purchase),
  clearError: getClearError(state.purchase),

  isValidatePending: isValidatePending(state.purchase),
  validateError: getValidateError(state.purchase),


})

const mapDispatchToProps = dispatch => bindActionCreators({
  getShoppingCart: shoppingCartService.getShoppingCart,
  clearShoppingCart: shoppingCartService.clearShoppingCart,
  getProductsCatalog: catalogService.getProductsCatalog,
  validateOrder: ordersService.validateOrder
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCartScreen);

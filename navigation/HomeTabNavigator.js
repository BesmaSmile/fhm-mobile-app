import React, { useEffect } from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProductsScreen from '../screens/app/ProductsScreen'

import Response from '../components/Response';
import Loading from '../components/Loading';
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import catalogService from '../services/catalog.service';
import shoppingCartService from '../services/shoppingCart.service';

import { getProductCategories, getProductsCatalog, getShoppingCart } from '../store/reducers/purchaseReducer';
import { useNavigation } from '@react-navigation/native';
import hooks from '../tools/hooks';

const Tab = createMaterialTopTabNavigator();

const TabButton = (props) => {
  const { name, state, index, navigation } = props
  return (
    <TouchableHighlight underlayColor={Colors.grayedColor1}
      onPress={() => {
        navigation.navigate(name)
      }}
      style={[styles.filter_button, props.navigationState.index == index ? styles.active : styles.inactive]}>
      <Text style={[styles.filter_text, props.navigationState.index == index ? styles.active_text : styles.inactive_text]}>{name}</Text>
    </TouchableHighlight>
  )
}

function TabBar({ props, productCategories }) {
  if (productCategories.length > 0)
    return (
      <View>
        {productCategories && <ScrollView showsHorizontalScrollIndicator={false}
          horizontal contentContainerStyle={styles.filters_scroll}>
          {productCategories.map((category, index) => {

            return <TabButton key={category.name} name={category.name} index={index} {...props} />
          })}
        </ScrollView>
        }
      </View>
    )
  else {
    return null
  }
}

function HomeTabNavigator(props) {
  const productCatalogRequest = hooks.useRequestState()
  const shoppingCartRequest = hooks.useRequestState()
  useEffect(() => {
    const { productCategories } = props
    if (productCategories.length == 0 && !productCatalogRequest.pending) {
      loadProductsCatalog()
    }
  }, [])

  useEffect(() => {
    const { productsCatalog, getShoppingCart, shoppingCart } = props

    if (productsCatalog && !shoppingCart && !shoppingCartRequest.pending) {
      shoppingCartRequest.sendRequest(getShoppingCart)
    }
  }, [props.productsCatalog])

  function loadProductsCatalog() {
    const { getProductsCatalog } = props
    productCatalogRequest.sendRequest(getProductsCatalog)
  }

  const { productCategories } = props
  const NotReadyScreen = () => {
    return (
      <>
        {productCatalogRequest.pending && <Loading />}
        {productCatalogRequest.error &&
          <Response text={productCatalogRequest.error}
            subText="Vérifier votre connexion et réssayez"
            icon='error'
            action="Réessayer"
            onClick={() => loadProductsCatalog()} />
        }
      </>
    )
  }
  return (
    <Tab.Navigator style={{ backgroundColor: Colors.lightColor }}
      swipeEnabled={false}
      tabBar={props => <TabBar {...{ props, productCategories }} />}>
      {productCategories.map(category => {
        const Screen = (props) => (<ProductsScreen {...props} category={category.name} />)
        return <Tab.Screen key={category.name} name={category.name}>
          {(props) => <ProductsScreen {...props} category={category.name} />}
        </Tab.Screen>
      })}
      {productCategories.length == 0 && <Tab.Screen name='notReady' component={NotReadyScreen} />}


    </Tab.Navigator>)
}


const styles = StyleSheet.create({
  filters_scroll: {
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'row',
    padding: Sizes.smallSpace,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 3,
    marginBottom: 3,
    marginTop: -5
  },
  filter_button: {
    marginTop: Sizes.mediumSpace,
    marginBottom: Sizes.mediumSpace,
    marginRight: Sizes.smallSpace,
    paddingLeft: Sizes.smallSpace,
    paddingRight: Sizes.smallSpace,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    backgroundColor: Colors.grayedColor1,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
  filter_text: {
    fontSize: Sizes.defaultTextSize,
  },
  active: {
    backgroundColor: Colors.mainColor,
  },
  inactive: {
    backgroundColor: Colors.grayedColor1,
  },
  active_text: {
    color: '#fff'
  },
  inactive_text: {
    color: '#000'
  }
})

const mapStateToProps = state => ({
  productCategories: getProductCategories(state.purchase),
  productsCatalog: getProductsCatalog(state.purchase),
  shoppingCart: getShoppingCart(state.purchase)

})

const mapDispatchToProps = dispatch => bindActionCreators({
  getProductsCatalog: catalogService.getProductsCatalog,
  getShoppingCart: shoppingCartService.getShoppingCart
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabNavigator);

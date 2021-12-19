import React from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getShoppingCart } from '../store/reducers/shoppingCartReducer';
import { getImageUrl, loadingImageUrlError } from '../store/reducers/imagesReducer';
import shoppingCartService from '../services/shoppingCart.service';
import imagesService from '../services/images.service';
import FastImage from 'react-native-fast-image';
import Icon from '../components/Icon'
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

class ProductCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      quantity: undefined
    }
  }

  componentDidMount() {
    const { imageUrl, getImageUrl, id, category } = this.props
    if (!imageUrl) {
      getImageUrl(category, id)
    }
  }

  _importedProductUsed() {
    const { shoppingCart, id } = this.props
    if (shoppingCart) {
      const element = shoppingCart.find(element => element.id == id)
      return element && element.imported
    }
    else return undefined
  }

  updateQuantity(value, additional, importation) {
    if (additional) {
      if (additional > 0 || parseInt(value) > 0) {
        const newQuantity = parseInt(value) + additional
        const { id, updateShoppingCart, forShoppingCart } = this.props
        updateShoppingCart(id, newQuantity, importation)

      }
    } else {
      this.setState({
        quantity: value || ""
      })
    }

  }

  _deleteArticle = () => {
    const { id, updateShoppingCart } = this.props
    updateShoppingCart(id, 0)
  }

  handleEndEditing = (e) => {

    if (this.state.quantity && this.state.quantity != "") {
      const { id, updateShoppingCart, forShoppingCart } = this.props
      updateShoppingCart(id, parseInt(this.state.quantity), forShoppingCart ? this._importedProductUsed() : this.props.importation)

    }
    setTimeout(() => {
      this.setState({
        quantity: undefined
      })
    }, 2000)
  }

  getContent() {
    return <></>
  }

  _displayShoppingCartAction(quantity, importation) {
    const { displayMode, available } = this.props
    const styles = displayMode == "list" ? listModeStyles : gridModeStyles
    const quantityValue = quantity + ""
    return (
      <View style={[sharedStyles.add_to_cart_container, styles.add_to_cart_container]}>
        <TouchableHighlight style={[sharedStyles.button, !available ? {opacity : 0.5}: {}] } disabled={!available}
          onPress={() => this.updateQuantity(quantity, -1, importation)}>
          <Text style={sharedStyles.button_text}>–</Text>
        </TouchableHighlight>
        <TextInput style={[sharedStyles.quantity_input,!available ? {opacity : 0.5}: {}]}
          disabled={!available}
          keyboardType={'number-pad'}
          value={quantityValue}
          onChangeText={(value) => this.updateQuantity(value, undefined, importation)}
          onEndEditing={this.handleEndEditing} />
        <TouchableHighlight style={[sharedStyles.button, !available ? {opacity : 0.5}: {}]}
          onPress={() => this.updateQuantity(quantity, 1, importation)}
          disabled={!available}>
          <Text style={sharedStyles.button_text}>+</Text>
        </TouchableHighlight>
      </View>
    )
  }

  render(content) {
    const { imageUrl, imageUrlError, width, displayMode } = this.props
    const styles = displayMode == "list" ? listModeStyles : gridModeStyles
    return (
      <View style={[sharedStyles.card_container, styles.card_container, { width: width }]}>

        <View style={[sharedStyles.image_container, styles.image_container]}>
          {!imageUrl  &&
            <View style={sharedStyles.loading_container}>
              <Icon viewBox="0 0 29 30"
                width="50px"
                height="20px"
                name="logo"
                fill={imageUrlError ? "#eee" : Colors.grayedColor} />
            </View>
          }
          {imageUrl &&
            <FastImage style={[sharedStyles.image, styles.image, { width: width }]}
              resizeMode={FastImage.resizeMode.contain}
              source={{ uri: imageUrl }} />
          }
        </View>
        {this.getContent()}
      </View>
    )
  }
}

class CatalogProductCardElement extends ProductCard {
  _getShoppingCartQuantity() {
    const { shoppingCart, id } = this.props
    if (shoppingCart) {
      const element = shoppingCart.find(element => element.id == id)
      return element ? element.quantity + "" : "0"
    }
    else return ""
  }

  getContent() {
    const { nameFr, nameAr, price, rating, imageUrl, importation,
      importationPrice, width, displayMode, imageUrlError } = this.props
    const styles = displayMode == "list" ? listModeStyles : gridModeStyles
    const quantity = this.state.quantity != undefined ? this.state.quantity : this._getShoppingCartQuantity()
    return (
      <View style={[sharedStyles.actions_container, styles.actions_container]}>
        <View style={sharedStyles.row_container}>
          <View style={styles.title_container}>
            <Text style={sharedStyles.title}>{nameFr}</Text>
            <Text style={sharedStyles.title_ar}>{nameAr}</Text>
          </View>
          <Text style={[sharedStyles.price, styles.price, { color: importation ? Colors.yellowColor : Colors.darkColor }]}>
            {importation ? importationPrice : price} DZA
                    </Text>
        </View>

        <View style={sharedStyles.row_container}>
          <Text style={sharedStyles.rating}>{rating}</Text>
          {this._displayShoppingCartAction(quantity, importation)}
        </View>
      </View>
    )
  }
}

class ShoppingCartProductCardElement extends ProductCard {
  getContent() {
    const { nameFr, nameAr, price, rating, imageUrl, importation,
      importationPrice, width, displayMode, imageUrlError, imported } = this.props
    const styles = listModeStyles
    const quantity = this.state.quantity != undefined ? this.state.quantity : (this.props.quantity || "")
    return (
      <View style={[sharedStyles.actions_container, styles.actions_container]}>
        <View style={sharedStyles.row_container}>
          {imported && <Text style={[listModeStyles.importation_text, { backgroundColor: Colors.yellowColor }]}>Importation</Text>}
          {!imported && <Text style={[listModeStyles.importation_text, { backgroundColor: '#eee', color: Colors.grayedColor2 }]}>Local</Text>}
          <TouchableHighlight style={listModeStyles.delete_button}
            underlayColor={'transparent'}
            onPress={this._deleteArticle}>
            <Icon viewBox="0 0 35 35"
              width="15px"
              height="15px"
              name='cross'
              fill='#000' />
          </TouchableHighlight>
        </View>

        <View style={sharedStyles.row_container}>
          <View style={styles.title_container}>
            <Text style={sharedStyles.title}>{nameFr}</Text>
            <Text style={sharedStyles.title_ar}>{nameAr}</Text>
          </View>
          <Text style={[sharedStyles.price, styles.price, { color: Colors.blueColor }]}>
            {quantity ? (imported ? importationPrice : price) * parseInt(quantity) : "---"} DZA

                    </Text>
        </View>

        <View style={sharedStyles.row_container}>

          <Text style={[sharedStyles.small_price, styles.bottom_price, { color: imported ? Colors.yellowColor : Colors.grayedColor2 }]}>
            {imported ? importationPrice : price} DZA
                    </Text>
          {this._displayShoppingCartAction(quantity, imported)}
        </View>
      </View>
    )
  }
}

class OrdersProductCardElement extends ProductCard {
  getContent() {
    const { nameFr, nameAr, price, rating, imageUrl, importation,
      importationPrice, width, displayMode, imageUrlError, quantity, imported, deliveredAt } = this.props
    //const quantity = quantity.toString()
    const styles = listModeStyles
    return (
      <View style={[sharedStyles.actions_container, styles.actions_container]}>

        <View style={sharedStyles.row_container}>
          <View style={styles.title_container}>
            <Text style={sharedStyles.title}>{nameFr}</Text>
            <Text style={sharedStyles.title_ar}>{nameAr}</Text>
          </View>
          <Text style={[sharedStyles.price, styles.price, { color: deliveredAt ? Colors.greenColor : Colors.blueColor }]}>
            {price * parseInt(quantity)} DZA

                    </Text>
        </View>

        <View style={sharedStyles.row_container}>

          <Text style={[sharedStyles.small_price, styles.bottom_price, { color: imported ? Colors.yellowColor : Colors.grayedColor2 }]}>
            {price} DZA ({quantity} kg)
                    </Text>
          {imported && <Text style={[listModeStyles.importation_text, { backgroundColor: Colors.yellowColor }]}>Importation</Text>}
          {!imported && <Text style={[listModeStyles.importation_text, { backgroundColor: '#eee', color: Colors.grayedColor2 }]}>Local</Text>}
        </View>
      </View>
    )
  }
}

const sharedStyles = StyleSheet.create({
  card_container: {
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: Sizes.smallSpace / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 1,
  },
  loading_container: {
    height: 100,
    margin: Sizes.smallSpace,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image_container: {
    borderRightWidth: 1,
    borderColor: '#eee'
  },
  image: {
    resizeMode: 'contain',
    margin: Sizes.smallSpace
  },
  actions_container: {
    justifyContent: 'space-around',
    padding: Sizes.smallSpace
  },
  row_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: Sizes.defaultTextSize,
    alignSelf: 'flex-start',
    color: Colors.darkColor,
  },
  title_ar: {
    fontSize: Sizes.smallText,
    alignSelf: 'flex-start',
    color: Colors.darkColor,
    textAlign: 'left'

  },
  price: {
    fontSize: Sizes.defaultTextSize,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  small_price: {
    fontSize: Sizes.smallText,
    textAlign: 'right'
  },
  add_to_cart_container: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden'

  },

  quantity_input: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    textAlign: 'center',
    fontSize: Sizes.defaultTextSize,
    padding: 0,
    color: Colors.darkColor
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blueColor
  },
  button_text: {
    fontSize: Sizes.defaultTextSize,
    color: '#fff',
    fontWeight: 'bold'
  },
  rating: {
    marginRight: Sizes.smallSpace,
    marginBottom: Sizes.smallSpace
  }
})
const listModeStyles = StyleSheet.create({
  card_container: {
    marginTop: 2,
    marginBottom: 2,
    flex: 1,
    flexDirection: 'row',
  },
  image_container: {
    flex: 3,
  },
  image: {
    height: 100,
  },
  actions_container: {
    flex: 5,
  },
  title_container: {
    flex: 3,
    marginRight: 3
  },
  price: {
    flex: 2,
  },
  bottom_price: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-end',
  },
  add_to_cart_container: {
    height: 35,
    width: 100,
  },
  delete_button: {
    height: 30,
    width: 30,
    borderRadius: 15,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  importation_text: {
    fontSize: Sizes.smallText,
    height: 25,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 5,
    color: '#fff',
  },
})
const gridModeStyles = StyleSheet.create({
  card_container: {
    height: 250,
  },
  image_container: {
    flex: 3,
  },
  image: {
    flex: 1,
    alignSelf: 'center',
  },
  actions_container: {
    flex: 2,
  },
  title_container: {
    flex: 5,
    alignItems: 'flex-start',
  },

  price: {
    flex: 3,
  },
  add_to_cart_container: {
    width: 80,
    height: 30
  },

})

const mapStateToProps = (state, ownProps) => ({
  shoppingCart: getShoppingCart(state.purchase),
  imageUrl: getImageUrl(state.images, ownProps.id),
  imageUrlError: loadingImageUrlError(state.images, ownProps.id)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateShoppingCart: shoppingCartService.updateShoppingCart,
  getImageUrl: imagesService.getImageUrl
}, dispatch)

export const CatalogProductCard = connect(mapStateToProps, mapDispatchToProps)(CatalogProductCardElement)
export const ShoppingCartProductCard = connect(mapStateToProps, mapDispatchToProps)(ShoppingCartProductCardElement)
export const OrdersProductCard = connect(mapStateToProps, mapDispatchToProps)(OrdersProductCardElement)

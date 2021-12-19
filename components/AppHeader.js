import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux'
import { getShoppingCartCount } from '../store/reducers/purchaseReducer';
import Icon from '../components/Icon'
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

const AppHeader = (props) => {
  const { shoppingCartCount, navigation } = props
  const name = props.scene.route.name
  let title
  switch (name) {
    case "ShoppingCartStack":
      title = 'Mon panier'
      break;
    case "Account":
      title = 'Mon profil'
      break
    case "EditProfile":
      title = ' '
      break
    case "Orders":
      title = 'Mes commandes'
      break
    case 'OrderDetails':
      title = 'Facture'
      break;
    default:
      break;
  }

  return (
    <View style={styles.header_container}>
      {name != 'EditProfile' && name != 'OrderDetails' &&
        <TouchableHighlight style={styles.rounded_button}
          underlayColor='transparent'
          onPress={() => { navigation.openDrawer() }}>
          <Icon viewBox="0 0 35 35"
            width="25px"
            height="25px"
            name='menu'
            fill={Colors.darkColor} />
        </TouchableHighlight>
      }
      {(name == 'EditProfile' || name == 'OrderDetails') &&
        <TouchableHighlight style={styles.rounded_button}
          underlayColor='transparent'
          onPress={() => { navigation.goBack() }}>
          <Icon viewBox="0 0 35 35"
            width="20px"
            height="20px"
            name='back'
            fill={Colors.grayedColor2} />
        </TouchableHighlight>
      }
      <View style={styles.logo_container}>
        {title && <Text style={styles.title}>{title}</Text>}
        {!title &&
          <>
            {/*<Text style={styles.app_name}>FHM</Text>*/}
            <Icon style={styles.logo_icon} viewBox="0 0 29 30"
              width="100px"
              height="40px"
              name="logo"
              fill={Colors.mainColor} />
          </>
        }

      </View>

      {(name != 'Account' && name != 'EditProfile') &&
        <TouchableHighlight style={styles.rounded_button}
          underlayColor='transparent'
          onPress={() => { navigation.navigate('ShoppingCart') }}>
          <>
            <Icon viewBox="0 0 32 32"
              width="25px"
              height="25px"
              name='shoppingCart'
              fill={Colors.darkColor} />
            {shoppingCartCount > 0 &&
              <Text style={styles.badge}> {shoppingCartCount}</Text>
            }
          </>
        </TouchableHighlight>
      }

      {name == 'Account' &&
        <TouchableHighlight style={styles.rounded_button}
          underlayColor='transparent'
          onPress={() => { navigation.navigate('EditProfile') }}>
          <Icon viewBox="0 0 32 32"
            width="25px"
            height="25px"
            name='pencil'
            fill={Colors.darkColor} />
        </TouchableHighlight>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  header_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
    padding: Sizes.smallSpace,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 1,
  },
  logo_container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: Sizes.defaultTextSize,
    fontWeight : "bold",
    fontFamily: 'Cochin',
    color: Colors.darkColor
  },
  app_name: {
    fontSize: Sizes.mediumText,
    fontFamily: 'Cochin',
    color: Colors.darkColor,
    fontWeight: 'bold'
  },
  logo_icon: {
    marginBottom: 2,
  },
  rounded_button: {
    height: 45,
    width: 45,
    borderRadius: 25,
    padding: Sizes.smallSpace,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badge: {
    position: 'absolute',
    top: 7,
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    right: -3,
    backgroundColor: Colors.redColor,
    fontSize: 12,
    fontWeight: 'bold'

  }
});

const mapStateToProps = (state) => ({
  shoppingCartCount: getShoppingCartCount(state.purchase),
})
export default connect(mapStateToProps)(AppHeader);

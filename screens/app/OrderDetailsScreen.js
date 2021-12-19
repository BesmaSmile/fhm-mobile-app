import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { OrdersProductCard } from '../../components/ProductCard';
import Icon from '../../components/Icon';
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';

import { format } from 'date-fns';
import { connect } from 'react-redux';
import { getOrder } from '../../store/reducers/purchaseReducer';
import shoppingCartService from '../../services/shoppingCart.service';

const OrderDetailsScreen = (props) => {
  const { orderId, total } = props.route.params
  const { order } = props
  const Header = (
    <>
      <View style={styles.header_container}>
        <View>
        <Text style={styles.id_text}>{order.id}</Text>
        <Text style={styles.header_text}>{order.articles.length} article(s)</Text>
        </View>
        {order.deliveredAt &&
          <View style={[styles.status_container, {
            backgroundColor: order.status=='paid' ? Colors.greenColor : Colors.orangeColor
          }]}>
            <Icon viewBox="0 0 35 35"
              width="15px"
              height="15px"
              name='correct'
              fill='#fff' />
          </View>
        }
        {order.status=='pending' &&
          <TouchableOpacity
            onPress={() => { props.navigation.navigate("ScanQRCode", {  order }) }}>
            <Icon viewBox="0 0 35 35"
              width="25px"
              height="25px"
              name='qrCode'
              fill={Colors.darkColor} />
          </TouchableOpacity>
        }
      </View>
      
      <View style={styles.content_container}>
        <View style={styles.row_container}>
          <Text style={styles.text}>Date de la commande</Text>
          <Text style={styles.text}>{format(order.createdAt, 'dd/MM/yyyy HH:mm')}</Text>
        </View>
        <View style={styles.row_container}>
          <Text style={styles.text}>Date de livraison</Text>
          <Text style={styles.text}>{order.deliveredAt ? format(order.deliveredAt, 'dd/MM/yyyy HH:mm') : "- - -"}</Text>
        </View>
        <View style={styles.row_container}>
          <Text style={styles.text}>Payement effectué le</Text>
          <Text style={styles.text}>{order.paidAt ? format(order.paidAt, 'dd/MM/yyyy HH:mm') : "- - -"}</Text>
        </View>
        <View style={styles.row_container}>
          <Text style={styles.text}>Total</Text>
          <Text style={styles.total_text}>{total} DZD</Text>
        </View>
      </View>
    </>
  )

  const Footer = (
    <View style={{ height: 20 }}></View>
  )

  const reuseOrder=()=>{
    props.reuseOrder(order).then(()=>{
       props.navigation.navigate("ShoppingCart")
    })
  }

  return (
    <View style={styles.main_container}>
      <FlatList style={styles.list}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        data={order.articles}
        renderItem={({ item }) => <OrdersProductCard {...item}
          deliveredAt={order.deliveredAt}
          category={item.category}
          displayMode='list' />}
        getItemLayout={(data, index) => ({ length: 100, offset: 100 * index, index })}
        keyExtractor={item => item.id} />
      <TouchableHighlight style={styles.large_button}
        underlayColor={Colors.mainColorOnPress}
        onPress={reuseOrder}>
        <Text style={styles.button_text}>Recommander</Text>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: Colors.lightColor,

  },
  list: {
    paddingLeft: Sizes.smallSpace,
    paddingRight: Sizes.smallSpace,
  },
  header_container: {
    padding: Sizes.mediumSpace,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  id_text : {
    fontSize : Sizes.defaultTextSize,
    fontWeight: 'bold'
  },
  header_text: {
    fontSize: Sizes.smallText,
    color: Colors.blueColor, 
  },
  status_container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Colors.greenColor,
  },
  content_container: {
    padding: Sizes.smallSpace,
    paddingLeft: Sizes.mediumSpace,
    paddingRight: Sizes.mediumSpace,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: Sizes.mediumSpace,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 1,
  },
  row_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Sizes.smallSpace,
    marginBottom: Sizes.smallSpace,
  },
  text: {
    fontSize: Sizes.smallText,
    color: Colors.darkColor,
  },
  total_text: {
    fontSize: Sizes.defaultTextSize,
    fontWeight: 'bold',
    color: Colors.darkColor,
  },
  large_button: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.mainColor,
    height: 45,
  },
  button_text: {
    color: Colors.lightColor,
    fontSize: Sizes.defaultTextSize
  },
})

const mapStateToProps = (state, props) => ({
  order: getOrder(state.purchase, props.route.params.orderId),
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reuseOrder: shoppingCartService.reuseOrder
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailsScreen);

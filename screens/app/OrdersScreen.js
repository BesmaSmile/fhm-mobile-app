import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { format } from 'date-fns';

import Response from '../../components/Response';
import Loading from '../../components/Loading';
import Icon from '../../components/Icon';
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getOrders } from '../../store/reducers/purchaseReducer';
import ordersService from '../../services/orders.service';
import hooks from '../../tools/hooks';

const OrderItem = ({ id, createdAt, status, deliveredAt, paidAt, total, showOrderDetails }) => (

  <TouchableOpacity style={styles.order_item_container}
    onPress={() => showOrderDetails(total)}>
    <View style={[styles.status_container, {
      backgroundColor: status=='paid' ? Colors.greenColor
        : (status=='delivered'  ? Colors.orangeColor
          : Colors.yellowColor)
    }]}>
      <Icon viewBox="0 0 35 35"
        width="20px"
        height="20px"
        name={status=='delivered' || status=='paid' ? 'correct'
          : 'hourglass'}
        fill='#fff' />
    </View>
    {/*<View style={styles.content_container}>
      <Text style={styles.content_text}>N° xxxxxx</Text>
      <Text style={styles.content_text}>{date && format(date, 'dd/MM/yyyy')}</Text>
    </View>*/}
    <View>
      <Text style={styles.id_text}>N° {id}</Text>
      <Text style={styles.date}>{createdAt && format(createdAt, 'dd/MM/yyyy')}</Text>
    </View>
    <Text style={styles.cost}>{total} DZA</Text>
  </TouchableOpacity>
)

//Mes commandes
const OrdersScreen = (props) => {
  const loadOrdersRequest = hooks.useRequestState()

  const calculateTotal = (articles) => {
    const total = articles.reduce((article1, article2) => ({
      price: article1.price * article1.quantity
        + article2.price * article2.quantity,
      quantity: 1
    }), { price: 0, quantity: 0 })
    return total.price
  }
  useEffect(() => {
    const { orders, getOrders } = props
    if (!orders && !loadOrdersRequest.pending) {
      loadOrders()
    }
  }, [])

  const loadOrders = () => {
    const { getOrders } = props
    loadOrdersRequest.sendRequest(getOrders)
  }
  const { orders, getOrders } = props
  return (
    <View style={styles.main_container}>
      {!orders && loadOrdersRequest.pending &&
        <Loading />
      }
      {!orders && loadOrdersRequest.error &&
        <Response text={loadOrdersRequest.error}
          subText="Vérifiez votre connexion et réessayez"
          icon='error'
          action="Réessayez"
          onClick={() => loadOrders()}
        />
      }
      {orders && orders.length == 0 &&
        <Response text="Vous n'avez envoyé aucune commande"
          subText="Commencez à remplir votre panier et envoyez vos commandes !"
          icon='empty'
        />
      }
      {orders && orders.length > 0 && <FlatList
        onRefresh={loadOrders}
        refreshing={loadOrdersRequest.pending}
        data={orders}
        renderItem={({ item }) => <OrderItem {...item}
          total={calculateTotal(item.articles)}
          showOrderDetails={(total) => props.navigation.navigate('OrderDetails', { orderId: item.id, total })} />}
        getItemLayout={(data, index) => ({ length: 100, offset: 100 * index, index })}
        keyExtractor={item => item.id} />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  order_item_container: {
    flex: 1,
    flexDirection: 'row',
    padding: Sizes.mediumSpace,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  status_container: {
    height:40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizes.mediumSpace,
    borderRadius:20,
    backgroundColor: Colors.greenColor,
  },
  id_text: {
    fontSize: Sizes.smallText,
    color: Colors.darkColor
  },
  date: {
    textAlignVertical: 'center',
    fontSize: Sizes.defaultTextSize,
    color: Colors.darkColor
  },
  cost: {
    flex: 1,
    textAlign: 'right',
    textAlignVertical: 'center',
    justifyContent: 'flex-end',
    fontSize: Sizes.defaultTextSize,
    fontWeight: 'bold',
    color: Colors.darkColor
  }
})

const mapStateToProps = (state, props) => ({
  orders: getOrders(state.purchase),
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getOrders: ordersService.getOrders
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen);

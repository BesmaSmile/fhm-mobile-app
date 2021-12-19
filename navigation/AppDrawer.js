import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { createDrawerNavigator } from '@react-navigation/drawer';
import authService from '../services/auth.service';
import messaging from '@react-native-firebase/messaging';

import HomeTabNavigator from './HomeTabNavigator';
import NewsScreen from '../screens/app/NewsScreen';
import ShoppingCartScreen from '../screens/app/ShoppingCartScreen';
import OrdersScreen from '../screens/app/OrdersScreen';
import OrderDetailsScreen from '../screens/app/OrderDetailsScreen';
import ScanQRCodeScreen from '../screens/app/ScanQRCodeScreen';
import AccountScreen from '../screens/app/AccountScreen';
import EditProfileScreen from '../screens/app/EditProfileScreen';
import SupportScreen from '../screens/app/SupportScreen';
import DrawerNav from '../components/DrawerNav';
import AppHeader from '../components/AppHeader';
import NotifService from '../services/notification.service';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import catalogService from '../services/catalog.service';
import newsService from '../services/news.service';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const createStackWithHeader = components => {
  return (
    <Stack.Navigator>
      {components.map(component => (
        <Stack.Screen
          key={component.name}
          name={component.name}
          component={component.render}
          options={{
            headerShown: true,
            header: props => <AppHeader {...props} />,
          }}
        />
      ))}
    </Stack.Navigator>
  );
};

const HomeStack = () =>
  createStackWithHeader([{ name: 'HomeStack', render: HomeTabNavigator }]);
const ShoppingCartStack = () =>
  createStackWithHeader([
    {
      name: 'ShoppingCartStack',
      render: ShoppingCartScreen,
    },
  ]);
const OrdersStack = () => createStackWithHeader([
  { name: "Orders", render: OrdersScreen },
  { name: "OrderDetails", render: OrderDetailsScreen },
  { name: "ScanQRCode", render: ScanQRCodeScreen }
])
const AccountStack = () => createStackWithHeader([
  { name: "Account", render: AccountScreen },
  { name: "EditProfile", render: EditProfileScreen },
])
const SupportStack = () => createStackWithHeader([{ name: "SupportStack", render: SupportScreen }])
const NewsStack = () => createStackWithHeader([{ name: "NewsStack", render: NewsScreen }])



const onNotif = (notif) => {
  Alert.alert(notif.title, notif.message);
}

const AppDrawer = (props) => {

  const notif = new NotifService(() => { }, onNotif);
  useEffect(() => {
    /*notif.localNotif({ticker : 'tocker', title: 'title', subText : 'subtext', message:'message',
    bigPictureUrl : 'https://firebasestorage.googleapis.com/v0/b/faci-hospitality-master-3d3e7.appspot.com/o/L%C3%A9gumes%2FN4Bw3cbFrQ1D1pUZEzZY?alt=media&token=193bc7fd-b818-4004-8084-85d0c60610f1',bigText:'bigtext'});
    */
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const notification = remoteMessage.notification
      notif.localNotif({
        title: notification.title, message: notification.body,
        bigPictureUrl: notification.android.imageUrl
      });
      if (remoteMessage.data.type == 'new_product') {
        const product = JSON.parse(remoteMessage.data.product)
        props.addNewProduct(product)
      }
      if(remoteMessage.data.type == 'news'){
        const news = JSON.parse(remoteMessage.data.news)
        props.addToNews(news)
      }

    });
    return unsubscribe
  })

  useEffect(() => {
    const unsubscribe = authService.storeTokens()
    return unsubscribe
  }, [])

  
  useEffect(()=>{
    props.getNews();
  }, [])

  return (
    <Drawer.Navigator initialRouteName='Home' drawerContent={(props) => <DrawerNav {...props} />}>
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="News" component={NewsStack} />
      <Drawer.Screen name="ShoppingCart" component={ShoppingCartStack} />
      <Drawer.Screen name="Orders" component={OrdersStack} />
      <Drawer.Screen name="Account" component={AccountStack} />
      <Drawer.Screen name="Support" component={SupportStack} />
    </Drawer.Navigator>
  );
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getNews: newsService.getNews,
  addToNews: newsService.addToNews,
  addNewProduct: catalogService.addNewProduct,
}, dispatch)

export default connect(() => ({}), mapDispatchToProps)(AppDrawer);

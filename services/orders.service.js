import firestore from '@react-native-firebase/firestore';
import { actions } from '../store/reducers/actions';
import authService from './auth.service';
import NetInfo from "@react-native-community/netinfo";
import { format } from 'date-fns';

export default {
  getOrders,
  validateOrder,
  confirmDelivery
}

function getOrders() {
  const userId = authService.getUserId()
  return dispatch => {
    return firestore().collection(`users/${userId}/orders`).get()
    .then(result => {
      const orders = result.docs.map(doc => { 
        const data= doc.data()
        return{
        ...data, 
        id: doc.id, 
        createdAt :data.createdAt.toDate() ,
        paidAt : data.paidAt && data.paidAt.toDate(),
        deliveredAt : data.deliveredAt && data.deliveredAt.toDate()
      }})
      .sort((o1, o2) => o1.createdAt < o2.createdAt)
      dispatch(actions.loadOrders(orders))
    })
      .catch(error => {
        console.log(error);
        throw "Erreur de chargement de vos commandes"
      })
  }
}

/*async function _initOrderId(userId){
  let stop=false
  let id;
  while(!stop){
    id=Date.now()+Math.floor(Math.random() * (99 - 10) ) + 10;
    await firestore().doc(`users/${userId}/commandes/${id}`).get().then(result=>{
      if (!result.exists) {
        stop=true
      }
    })
  }
  return id
}*/

function validateOrder(order, callbak) {
  const userId = authService.getUserId()
  return dispatch => {
    dispatch(actions.validateOrder())
    NetInfo.fetch().then(state => {

      if (state.isInternetReachable) {
        const orderId =format(order.createdAt.toDate(), 'ddMMyyyyHHmmss')+Math.floor(Math.random() * (99 - 10) ) + 10;
        return firestore().collection(`users/${userId}/orders`).doc(orderId).set(order).then((response) => {
          return firestore().collection(`users/${userId}/shoppingCart`).get().then(result => {
            result.docs.forEach(doc => {
              doc.ref.delete()
            });
            dispatch(actions.validateOrderSuccess({ ...order, id: orderId, createdAt : order.createdAt.toDate() }))
            dispatch(actions.clearShoppingCartSuccess())
            callbak()
          }).catch(error => {
            console.log(error);
            dispatch(actions.validateOrderSuccess({ ...order, id: orderId}))
            dispatch(actions.validateOrderFailure("Votre commande a été envoyé mais le panier n'a pas été vidé!"))
            dispatch(actions.validateOrderFailure())
          })
        }).catch(error => {
          console.log(error);
          dispatch(actions.validateOrderFailure("Erreur d'envoi de votre commande. Réssayez plus tard!"))
          dispatch(actions.validateOrderFailure())
        })
      } else {
        dispatch(actions.validateOrderFailure("Echec de connexion !"))
        dispatch(actions.validateOrderFailure())
      }
    });
  }
}

function confirmDelivery(order, callbak) {
  const userId = authService.getUserId()
  return dispatch => {
    dispatch(actions.confirmDelivery())
    NetInfo.fetch().then(state => {
      if (state.isInternetReachable) {
        const deliveredAt = firestore.Timestamp.now()
        return firestore().doc(`users/${userId}/orders/${order.id}`)
          .update({ deliveredAt, status : 'delivered', articles : order.articles.map(article=>(
            {
              id : article.id, 
              quantity : article.quantity, 
              price :parseInt(article.price), 
              ...(article.imported ? {imported : true} : {})
            }))
          }).then((response) => {
            dispatch(actions.confirmDeliverySuccess(order.id, deliveredAt.toDate()))
            callbak()
          }).catch(error => {
            console.log(error);
            dispatch(actions.confirmDeliveryFailure("Erreur de confirmation de la livraison. Réssayez plus tard!"))
            dispatch(actions.confirmDeliveryFailure())
          })
      } else {
        dispatch(actions.confirmDeliveryFailure("Echec de connexion !"))
        dispatch(actions.confirmDeliveryFailure())
      }
    });
  }
}

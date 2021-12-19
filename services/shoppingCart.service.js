import firestore from '@react-native-firebase/firestore';
import { actions } from '../store/reducers/actions';
import NetInfo from "@react-native-community/netinfo";
import authService from './auth.service';

export default {
  getShoppingCart,
  updateShoppingCart,
  clearShoppingCart,
  reuseOrder
}

function getShoppingCart() {
  const userId = authService.getUserId()
  return dispatch => {
    return firestore().collection(`users/${userId}/shoppingCart`).get().then(result => {
      dispatch(actions.loadShoppingCart(result.docs.map(doc => ({ ...doc.data(), id: doc.id, }))))
    })
      .catch(error => {
        throw "Erreur de chargement de votre panier"
      })
  }
}

function updateShoppingCart(productId, quantity, importation) {
  const userId = authService.getUserId()
  return dispatch => {
    dispatch(actions.updateShoppingCartRequest())
    NetInfo.fetch().then(state => {

      if (state.isInternetReachable) {
        if (quantity > 0) {
          return firestore().doc(`users/${userId}/shoppingCart/${productId}`).set(
            importation == true ? {
              quantity,
              imported: true
            } :
              { quantity }
          ).then(() => {
            dispatch(actions.updateShoppingCartSuccess(productId, quantity, importation))
          }).catch(error => {
            console.log(error);
            dispatch(actions.updateShoppingCartFailure("Erreur de mise à jour de  votre panier. Réssayez plus tard!"))
            dispatch(actions.updateShoppingCartFailure())
          })
        } else {
          return firestore().doc(`users/${userId}/shoppingCart/${productId}`).delete().then(() => {
            dispatch(actions.updateShoppingCartSuccess(productId, quantity))
          }).catch(error => {
            console.log(error);
            dispatch(actions.updateShoppingCartSuccessFailure("Erreur de mise à jour de  votre panier. Réssayez plus tard!"))
            dispatch(actions.updateShoppingCartFailure())
          })
        }
      } else {
        console.log("echec de connexion");
        dispatch(actions.updateShoppingCartFailure("Echec de connexion !"))
        dispatch(actions.updateShoppingCartFailure())
      }
    });

  }
}

function clearShoppingCart() {
  const userId = authService.getUserId()
  return dispatch => {
    dispatch(actions.clearShoppingCartRequest())
    NetInfo.fetch().then(state => {
      if (state.isInternetReachable) {
        const batch = firestore().batch();
        return firestore().collection(`users/${userId}/shoppingCart`).get().then(result => {
          result.docs.forEach(doc => {
            //doc.ref.delete()
            batch.delete(doc.ref)
          });
          batch.commit().then(()=>{
            dispatch(actions.clearShoppingCartSuccess())
          }).catch(error => {
            console.log(error);
            dispatch(actions.clearShoppingCartFailure("Erreur de mise à jour de  votre panier. Réssayez plus tard!"))
            dispatch(actions.clearShoppingCartFailure())
          })
          
        }).catch(error => {
          console.log(error);
          dispatch(actions.clearShoppingCartFailure("Erreur de mise à jour de  votre panier. Réssayez plus tard!"))
          dispatch(actions.clearShoppingCartFailure())
        })
      } else {
        dispatch(actions.clearShoppingCartFailure("Echec de connexion !"))
        dispatch(actions.clearShoppingCartFailure())
      }
    });

  }
}

function reuseOrder(order){
  const userId = authService.getUserId()
  return dispatch => {
    const batch = firestore().batch();
    const articles = order.articles.map(article=>({
      id : article.id,
      quantity : article.quantity , 
      ...(article.imported ? {imported : true} : {})
    }))
    articles.forEach(article => {
      const docRef= firestore().doc(`users/${userId}/shoppingCart/${article.id}`);
      const {id, ...toAdd} = article
      batch.set(docRef, toAdd);
    });
    return batch.commit().then(() =>{
      dispatch(actions.reuseOrder(articles))
      return articles
    });
  }
}
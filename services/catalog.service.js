import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { actions } from '../store/reducers/actions';

export default {
  getProductsCatalog,
  getImageUrl,
  addNewProduct
}

function getProductsCatalog() {
  return dispatch => {
    let categories;
    return firestore().collection('categories').get().then(result => {
      categories = result.docs.map(doc => {
        const category = doc.data()
        return {
          ...category,
          subCategories: category.subCategories ? ["Tout", ...category.subCategories] : undefined
        }
      }).sort((c1, c2) => c1.order > c2.order)
      return firestore().collection('products').get()
    }).then(products => {
      dispatch(actions.loadProductsCatalog(categories, products.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
    }).catch(error => {
      console.log(error)
      throw "Erreur de chargement des produits"
    })
  }
}

function getImageUrl(category, imageName) {
  const ref = storage().ref(`${category}/${imageName}`);
  return ref.getDownloadURL().then(result => result).catch(error => {
    console.log("erreur chargement image: " + error)
  });
}

function addNewProduct(product){
  return dispatch => {
    dispatch(actions.addNewProduct(product))      
  }
}
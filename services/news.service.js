import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { actions } from '../store/reducers/actions';

export default {
  getNews,
  resetNewsCount,
  addToNews,
}

function getNews() {
  return dispatch => {
    return firestore().collection('news').get().then(result => {
      dispatch(actions.loadNews(result.docs.map(doc =>{
        const data= doc.data()
        return{
        ...data, 
        id: doc.id, 
        createdAt :data.createdAt?.toDate(),
      }})
      .sort((n1, n2) => n1.createdAt < n2.createdAt)))
    }).catch(error => {
      console.log(error)
      throw "Erreur de chargement des nouveautés"
    })
  }
}

function resetNewsCount() {
  return dispatch => {
    dispatch(actions.resetNewsCount())
  }
}

function addToNews(news) {
  return dispatch => {
    dispatch(actions.addToNews(news))
  }
}
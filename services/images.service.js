import storage from '@react-native-firebase/storage';
import { actions } from '../store/reducers/actions';

export default {
  getImageUrl,
}

function getImageUrl(path, name) {
  return dispatch => {
    dispatch(actions.loadImageUrl(name))
    const ref = storage().ref(`${path}/${name}`);
    return ref.getDownloadURL().then(imageUrl => {
      dispatch(actions.loadImageUrlSuccess(name, imageUrl))
    })
      .catch(error => {
        console.log(error)
        dispatch(actions.loadImageUrlFailure(name, "Echec de chargement de l'image"))
      });
  }
}

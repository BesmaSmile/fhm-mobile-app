import { constants } from './actions';
const initialState = {
  imageUrl: {},
  loadingImageUrl: {},
  loadingImageUrlError: {},
}

function imagesReducer(state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_IMAGE_URL_REQUEST:
      return {
        ...state,
        loadingImageUrl: {
          ...state.loadingImageUrl,
          [action.name]: true
        },
        loadingImageUrlError: {
          ...state.loadingImageUrlError,
          [action.name]: undefined
        }
      }
    case constants.LOAD_IMAGE_URL_SUCCESS:
      return {
        ...state,
        loadingImageUrl: {
          ...state.loadingImageUrl,
          [action.name]: false
        },
        imageUrl: {
          ...state.imageUrl,
          [action.name]: action.url
        }
      }
    case constants.LOAD_IMAGE_URL_FAILURE:
      return {
        ...state,
        loadingImageUrl: {
          ...state.loadingImageUrl,
          [action.name]: false
        },
        loadingImageUrlError: {
          ...state.loadingImageUrlError,
          [action.name]: action.error
        }
      }
    default : return state;
  }
}

export const getImageUrl = (state, name) => state.imageUrl[name]
export const loadingImageUrl = (state, name) => state.loadingImageUrl[name]
export const loadingImageUrlError = (state, name) => state.loadingImageUrlError[name]

export default imagesReducer
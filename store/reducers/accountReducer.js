import { constants } from './actions';

function accountReducer(state = { loadingAccount: true }, action) {
  switch (action.type) {
    case constants.CONFIRM_PHONE_NUMBER:
      return {
        ...state,
        confirmationResult: action.confirmationResult
      }
    case constants.SIGNED_IN:
      return {
        ...state,
        signInMethod : action.signInMethod,// || state.signInMethod,
        userProfile: action.userProfile ,//|| state.userProfile,
        userAccount: action.userAccount,// || state.userAccount,
        loadingAccount: false
      }
    case constants.SIGNED_OUT:
      return {
        ...state,
        loadingAccount: false,
        userProfile: undefined,
        userAccount: undefined,
        signInMethod: undefined
      }

    case constants.LOAD_PROFILE:
      {
        return {
          ...state,
          userProfile: action.userProfile
        }
      }

    case constants.UPDATE_PROFILE:
      {
        return {
          ...state,
          userProfile: {
            ...state.userProfile,
            ...action.userProfile
          }
        }
      }

    case constants.UPDATE_PROFILE_PHOTO:
      {
        return {
          ...state,
          userAccount: {
            ...state.userAccount,
            photoURL: action.photoURL
          }
        }
      }

    default:
      return state;
  }
}

export const getConfirmationResult = state => state.confirmationResult;
export const getUserProfile = state => state.userProfile;

export const getUserAccount = state => state.userAccount;
export const signInMethod = state => state.signInMethod;
export const isLoadingAccount = state => state.loadingAccount;
export default accountReducer;
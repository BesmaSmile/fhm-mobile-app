import { constants } from './actions';

function shoppingCartReducer(state = {}, action) {
    switch(action.type) {
        case constants.LOAD_SHOPPING_CART_REQUEST:
            return {
                ...state,
                loading:true,
                loadingError:undefined
            }
        case constants.LOAD_SHOPPING_CART_SUCCESS:
            return {
                ...state,
                shoppingCart: action.shoppingCart,
                loading:false
            }
        case constants.LOAD_SHOPPING_CART_FAILURE:
            return {
                ...state,
                loading:false,
                loadingError:action.loadingError,
            }

        case constants.UPDATE_SHOPPING_CART_REQUEST:
            return {
                ...state,
                updatePending:true,
                updateError:undefined
            }
        case constants.UPDATE_SHOPPING_CART_SUCCESS:
            const { shoppingCart }=state
            const { newElement }= action
            const oldElement=shoppingCart.find(e=>e.id==newElement.id)

            return {
                ...state,
                shoppingCart:
                    oldElement ? (
                                    newElement.quantity>0 ? shoppingCart.map(e=>e.id==newElement.id ? newElement : e)
                                                          : shoppingCart.filter(e=>e.id!=newElement.id)
                                )
                                : [...shoppingCart, newElement],
                updatePending:false
            }
        case constants.UPDATE_SHOPPING_CART_FAILURE:
            return {
                ...state,
                updateError:action.updateError,
            }
        case constants.CLEAR_SHOPPING_CART_REQUEST:
            return {
                ...state,
                clearPending:true,
                cleareError:undefined
            }
        case constants.CLEAR_SHOPPING_CART_SUCCESS:
            return {
                ...state,
                clearPending:false,
                shoppingCart :[]
            }
        case constants.CLEAR_SHOPPING_CART_FAILURE:
            return {
                ...state,
                clearPending:false,
                clearError :action.clearError
            }

        case constants.REUSE_ORDER :
            return {
                ...state,
                shoppingCart : [...state.shoppingCart,...action.articles]
            }
        case constants.SIGNED_OUT:
            return {}

        
        default:
            return state;
    }
}

export const getShoppingCart = (state) =>state.shoppingCart

export const getShoppingCartCount = state => state.shoppingCart ? state.shoppingCart.length : 0
export const isLoading = state => state.loading
export const getLoadingError = state => state.loadingError

export const isUpdatePending = state => state.updatePending
export const getUpdateError = state => state.updateError
export const isClearPending = state => state.clearPending
export const getClearError = state => state.clearError
export default shoppingCartReducer

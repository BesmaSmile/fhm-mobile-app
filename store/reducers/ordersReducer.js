import { constants } from './actions';
//import { getProductsCatalog } from './productsCatalogReducer';
function ordersReducer(state = {}, action) {
    switch(action.type) {
        case constants.LOAD_ORDERS_REQUEST:
            return {
                ...state,
                loading:true,
                loadingError:undefined
            }
        case constants.LOAD_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.orders,
                loading:false
            }
        case constants.LOAD_ORDERS_FAILURE:
            return {
                ...state,
                loading:false,
                loadingError:action.loadingError,
            }
        case constants.VALIDATE_ORDER_REQUEST:
            return {
                ...state,
                validatePending:true,
                loadingError:undefined
            }
        case constants.VALIDATE_ORDER_SUCCESS:
            const { orders }=state
            return {
                ...state,
                orders:orders ? [action.order, ...orders ] : undefined,
                validatePending:false
            }
        case constants.VALIDATE_ORDER_FAILURE:
            return {
                ...state,
                validatePending:false,
                validateError:action.validateError,
            }

        case constants.CONFIRM_DELIVERY_REQUEST:
            return {
                ...state,
                confirmDeliveryPending: true
            }
        case constants.CONFIRM_DELIVERY_SUCCUSS:
            const { orderId, deliveredAt }=action
            return {
                ...state,
                confirmDeliveryPending: false,
                orders: state.orders.map(order=>order.id==orderId ? {...order, deliveredAt} : order)
            }
        case constants.CONFIRM_DELIVERY_FAILURE:
            return{
                ...state,
                confirmDeliveryPending: false,
                confirmDeliveryError:action.error
            }
        case constants.SIGNED_OUT:
            return {}

        default:
            return state;
    }
}

export const getOrders = (ordersState, catalogState) =>
    (ordersState.orders && catalogState.productsCatalog)
    ? ordersState.orders.map(order=>{
        const articles=order.articles.map(article=>{
            const product= catalogState.productsCatalog.find(product=>product.id==article.id)
            return {
                ...article,
                ...product,
                price : article.deliveredAt ?article.price :(article.imported ? product.importationPrice : product.price)
            };
        })
        return {
            ...order,
            articles
        }
    }) : undefined

export const isLoading = state => state.loading
export const getLoadingError = state => state.loadingError

export const isValidatePending = state => state.validatePending
export const getValidateError = state => state.validateError

export const isConfirmDeliveryPending = state =>state.confirmDeliveryPending
export const getConfirmDeliveryError = state =>state.confirmDeliveryError

export default ordersReducer

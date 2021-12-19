import { constants } from './actions';
const initialState = {
  productImageUrl: {},
  loadingProductImageUrl: {},
  loadingProductImageUrlError: {},
  productCategories: [],
  confirmDeliveryPending: false,
}

function purchaseReducer(state = initialState, action) {
  switch (action.type) {
    //Products Catalog

    case constants.LOAD_PRODUCTS_CATALOG:
      return {
        ...state,
        productCategories: action.productCategories,
        productsCatalog: action.productsCatalog
      }

    //Shopping Cart

    case constants.LOAD_SHOPPING_CART:
      const articleItems = action.shoppingCart.map(article => {
        const product = state.productsCatalog.find(product => product.id == article.id)
        return {
          ...article,
          ...product
        }
      })
      return {
        ...state,
        shoppingCart: articleItems,
        loadingShoppingCart: false
      }

    case constants.UPDATE_SHOPPING_CART_REQUEST:
      return {
        ...state,
        updatePending: true,
        updateError: undefined
      }
    case constants.UPDATE_SHOPPING_CART_SUCCESS:
      const { shoppingCart } = state
      const { newElement } = action
      const oldElement = shoppingCart.find(e => e.id == newElement.id)

      const product = state.productsCatalog.find(product => product.id == newElement.id)

      return {
        ...state,
        shoppingCart: oldElement ? (newElement.quantity > 0 ? shoppingCart.map(e => e.id == newElement.id ? { ...newElement, ...product } : e) :
          shoppingCart.filter(e => e.id != newElement.id)) : [...shoppingCart, { ...newElement, ...product }],
        updatePending: false
      }
    case constants.UPDATE_SHOPPING_CART_FAILURE:
      return {
        ...state,
        updateError: action.updateError,
      }
    case constants.CLEAR_SHOPPING_CART_REQUEST:
      return {
        ...state,
        clearPending: true,
        cleareError: undefined
      }
    case constants.CLEAR_SHOPPING_CART_SUCCESS:
      return {
        ...state,
        clearPending: false,
        shoppingCart: []
      }
    case constants.CLEAR_SHOPPING_CART_FAILURE:
      return {
        ...state,
        clearPending: false,
        clearError: action.clearError
      }

    //Orders

    case constants.LOAD_ORDERS:
      const orderItems = action.orders.map(order => {
        const articles = order.articles.map(article => {
          const product = state.productsCatalog.find(product => product.id == article.id)
          return {
            ...article,
            ...product,
            price: article.deliveredAt ? article.price : (article.imported ? product.importationPrice : product.price)
          };
        })
        return {
          ...order,
          articles
        }
      })
      return {
        ...state,
        orders: orderItems,
      }
    case constants.VALIDATE_ORDER_REQUEST:
      return {
        ...state,
        validatePending: true,
        validateError: undefined
      }
    case constants.VALIDATE_ORDER_SUCCESS:
      const { orders } = state
      const articles = action.order.articles.map(article => {
        const product = state.productsCatalog.find(product => product.id == article.id)
        return {
          ...article,
          ...product,
          price: article.deliveredAt ? article.price : (article.imported ? product.importationPrice : product.price)
        };
      })
      return {
        ...state,
        orders: orders ? [{ ...action.order, articles }, ...orders] : undefined,
        validatePending: false
      }
    case constants.VALIDATE_ORDER_FAILURE:
      return {
        ...state,
        validatePending: false,
        validateError: action.validateError,
      }
    case constants.CONFIRM_DELIVERY_REQUEST:
      return {
        ...state,
        confirmDeliveryPending: true
      }
    case constants.CONFIRM_DELIVERY_SUCCUSS:
      const { orderId, deliveredAt } = action
      return {
        ...state,
        confirmDeliveryPending: false,
        orders: state.orders.map(order => order.id == orderId ? { ...order, deliveredAt, status: 'delivered' } : order)
      }
    case constants.CONFIRM_DELIVERY_FAILURE:
      return {
        ...state,
        confirmDeliveryPending: false,
        confirmDeliveryError: action.error
      }
    case constants.REUSE_ORDER:
      const addedArticles = action.articles.map(article => {
        const product = state.productsCatalog.find(product => product.id == article.id)
        return {
          ...article,
          ...product
        }
      })
      return {
        ...state,
        shoppingCart: [...state.shoppingCart.filter(article => !addedArticles.some(a => a.id == article.id)), ...addedArticles.filter(article => article.available)],
      }
    case constants.SIGNED_OUT:
      return {
        ...state,
        shoppingCart: undefined,
        orders: undefined
      }
    default:
      return state
  }
}

//Products Catalog
export const getProductCategories = (state) => state.productCategories
export const getProductCategory = (state, category) => state.productCategories.find(c => c.name == category)
export const getProductsCatalog = (state) => state.productsCatalog //category && state.productsCatalog ? state.productsCatalog.filter(product=>product.categorie==category) : state.productsCatalog

//Shopping Cart
export const getShoppingCart = (state) => state.shoppingCart
export const getShoppingCartCount = state => state.shoppingCart ? state.shoppingCart.length : 0
export const isLoadingShoppingCart = state => state.loadingShoppingCart
export const getLoadingShoppingCartError = state => state.loadingShoppingCartError
export const isUpdatePending = state => state.updatePending
export const getUpdateError = state => state.updateError
export const isClearPending = state => state.clearPending
export const getClearError = state => state.clearError

//Orders
export const getOrders = (state) => state.orders
export const getOrder = (state, orderId) => state.orders.find(order => order.id == orderId)
export const isValidatePending = state => state.validatePending
export const getValidateError = state => state.validateError
export const isConfirmDeliveryPending = state => state.confirmDeliveryPending
export const getConfirmDeliveryError = state => state.confirmDeliveryError


export default purchaseReducer
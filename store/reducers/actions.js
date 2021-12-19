export const constants = {
  CONFIRM_PHONE_NUMBER: ' CONFIRM_PHONE_NUMBER',

  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT',

  LOAD_PROFILE: 'LOAD_PROFILE',

  LOAD_PRODUCTS_CATALOG: 'LOAD_PRODUCTS_CATALOG',
  LOAD_SHOPPING_CART: 'LOAD_SHOPPING_CART',

  LOAD_IMAGE_URL_REQUEST: 'LOAD_IMAGE_URL_REQUEST',
  LOAD_IMAGE_URL_SUCCESS: 'LOAD_IMAGE_URL_SUCCESS',
  LOAD_IMAGE_URL_FAILURE: 'LOAD_IMAGE_URL_FAILURE',



  UPDATE_SHOPPING_CART_REQUEST: 'UPDATE_SHOPPING_CART_REQUEST',
  UPDATE_SHOPPING_CART_SUCCESS: 'UPDATE_SHOPPING_CART_SUCCESS',
  UPDATE_SHOPPING_CART_FAILURE: 'UPDATE_SHOPPING_CART_FAILURE',

  CLEAR_SHOPPING_CART_REQUEST: 'CLEAR_SHOPPING_CART_REQUEST',
  CLEAR_SHOPPING_CART_SUCCESS: 'CLEAR_SHOPPING_CART_SUCCESS',
  CLEAR_SHOPPING_CART_FAILURE: 'CLEAR_SHOPPING_CART_FAILURE',

  LOAD_ORDERS: 'LOAD_ORDERS',

  VALIDATE_ORDER_REQUEST: 'VALIDATE_ORDER_REQUEST',
  VALIDATE_ORDER_SUCCESS: 'VALIDATE_ORDER_SUCCESS',
  VALIDATE_ORDER_FAILURE: 'VALIDATE_ORDER_FAILURE',

  CONFIRM_DELIVERY_REQUEST: 'CONFIRM_DELIVERY_REQUEST',
  CONFIRM_DELIVERY_SUCCUSS: 'CONFIRM_DELIVERY_SUCCUSS',
  CONFIRM_DELIVERY_FAILURE: 'CONFIRM_DELIVERY_FAILURE',

  UPDATE_PROFILE: 'UPDATE_PROFILE',

  UPDATE_PROFILE_PHOTO: 'UPDATE_PROFILE_PHOTO',

  REUSE_ORDER : 'REUSE_ORDER',
  ADD_NEW_PRODUCT : 'ADD_NEW_PRODUCT',

  LOAD_NEWS: 'LOAD_NEWS',
  ADD_TO_NEWS : 'ADD_NEWS',
  RESET_NEWS_COUNT: 'RESET_NEWS_COUNT'
}

export const actions = {
  confirmPhoneNumber,
  signedIn,
  signedOut,
  loadProfile,

  loadProductsCatalog,
  loadImageUrl,
  loadImageUrlSuccess,
  loadImageUrlFailure,
  loadShoppingCart,
  updateShoppingCartRequest,
  updateShoppingCartSuccess,
  updateShoppingCartFailure,
  clearShoppingCartRequest,
  clearShoppingCartSuccess,
  clearShoppingCartFailure,
  validateOrder,
  validateOrderSuccess,
  validateOrderFailure,
  loadOrders,
  confirmDelivery,
  confirmDeliverySuccess,
  confirmDeliveryFailure,
  updateProfile,
  updateProfilePhoto,
  reuseOrder,
  addNewProduct,
  loadNews,
  addToNews,
  resetNewsCount,
}

function confirmPhoneNumber(confirmationResult) {
  return {
    type: constants.CONFIRM_PHONE_NUMBER,
    confirmationResult: confirmationResult,
    pendding: false
  }
}

function signedIn(signInMethod, userProfile, userAccount) {
  return {
    type: constants.SIGNED_IN,
    signInMethod,
    userProfile,
    userAccount,
  }
}

function signedOut() {
  return {
    type: constants.SIGNED_OUT
  }
}

function loadProfile(userProfile) {
  return {
    type: constants.LOAD_PROFILE,
    userProfile
  }
}


function loadProductsCatalog(productCategories, productsCatalog) {
  return {
    type: constants.LOAD_PRODUCTS_CATALOG,
    productCategories,
    productsCatalog
  }
}

function loadShoppingCart(shoppingCart) {
  return {
    type: constants.LOAD_SHOPPING_CART,
    shoppingCart,
  }
}

function loadImageUrl(name) {
  return {
    type: constants.LOAD_IMAGE_URL_REQUEST,
    name
  }
}

function loadImageUrlSuccess(name, url) {
  return {
    type: constants.LOAD_IMAGE_URL_SUCCESS,
    name,
    url
  }
}

function loadImageUrlFailure(name, error) {
  return {
    type: constants.LOAD_IMAGE_URL_FAILURE,
    name,
    error
  }
}

function updateShoppingCartRequest() {
  return {
    type: constants.UPDATE_SHOPPING_CART_REQUEST
  }
}

function updateShoppingCartSuccess(id, quantity, imported) {
  return {
    type: constants.UPDATE_SHOPPING_CART_SUCCESS,
    newElement: { id, quantity, imported }
  }
}

function updateShoppingCartFailure(updateError) {
  return {
    type: constants.UPDATE_SHOPPING_CART_FAILURE,
    updateError
  }
}

function confirmDelivery() {
  return {
    type: constants.CONFIRM_DELIVERY_REQUEST
  }
}

function confirmDeliverySuccess(orderId, deliveredAt) {
  return {
    type: constants.CONFIRM_DELIVERY_SUCCUSS,
    orderId,
    deliveredAt
  }
}

function confirmDeliveryFailure(error) {
  return {
    type: constants.CONFIRM_DELIVERY_FAILURE,
    error
  }
}

function clearShoppingCartRequest() {
  return {
    type: constants.CLEAR_SHOPPING_CART_REQUEST
  }
}

function clearShoppingCartSuccess() {
  return {
    type: constants.CLEAR_SHOPPING_CART_SUCCESS,
  }
}

function clearShoppingCartFailure(clearError) {
  return {
    type: constants.CLEAR_SHOPPING_CART_FAILURE,
    clearError
  }
}

function loadOrders(orders) {
  return {
    type: constants.LOAD_ORDERS,
    orders,
  }
}

function validateOrder() {
  return {
    type: constants.VALIDATE_ORDER_REQUEST
  }
}

function validateOrderSuccess(order) {
  return {
    type: constants.VALIDATE_ORDER_SUCCESS,
    order
  }
}

function validateOrderFailure(validateError) {
  return {
    type: constants.VALIDATE_ORDER_FAILURE,
    validateError
  }
}

function updateProfile(userProfile) {
  return {
    type: constants.UPDATE_PROFILE,
    userProfile
  }
}


function updateProfilePhoto(photoURL) {
  return {
    type: constants.UPDATE_PROFILE_PHOTO,
    photoURL
  }
}

function reuseOrder(articles){
  return {
    type: constants.REUSE_ORDER,
    articles
  }
}

function addNewProduct(product){
  return {
    type :constants.ADD_NEW_PRODUCT,
    product
  }
}

function addToNews(news){
  return {
    type : constants.ADD_TO_NEWS,
    news,
  }
}

function resetNewsCount(){
  return {
    type : constants.RESET_NEWS_COUNT,
  }
}

function loadNews(news){
  return {
    type: constants.LOAD_NEWS,
    news
  }
}
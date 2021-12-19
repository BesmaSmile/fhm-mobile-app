import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import accountReducer from './reducers/accountReducer';
import purchaseReducer from './reducers/purchaseReducer';
import newsReducer from './reducers/newsReducer';
import imagesReducer from './reducers/imagesReducer';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist : ['account', 'news']
}

const rootReducer = combineReducers({
    account: accountReducer,
    purchase:  purchaseReducer,
    news: newsReducer,
    images: imagesReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)
const middlewares = [thunk];
export const store = createStore(persistedReducer, {}, applyMiddleware(...middlewares));
export const persistor = persistStore(store)
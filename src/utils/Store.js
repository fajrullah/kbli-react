import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { devToolsEnhancer } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './Reducers';

const persistConfig = {
  key: 'primary',
  storage,
}
const persistedReducers = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducers,compose(
        applyMiddleware(thunk),
        devToolsEnhancer(),
      ))
const persistor =   persistStore(store)

export { store, persistor}


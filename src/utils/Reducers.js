import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import {
  SET_FETCHING,
  SET_USER,
  DELETE_USER,
  SET_TOKEN,
  DELETE_TOKEN,
  SET_AUTH,
} from './Action';

const persistDefault = {
};

const userDefault = {
  user : ''
}

const tokenDefault = {
  token : ''
}


function user(state = userDefault, action) {
  switch (action.type) {
    case SET_USER:
      return Object.assign({},state,{ user : action.user.email, level : action.user.level});
    case DELETE_USER:
      return userDefault;
    default:
      return state;
  }
}

function token(state = tokenDefault, action) {
  switch (action.type) {
    case SET_TOKEN:
      return Object.assign({},state,{ token : action.token.token});
    case DELETE_TOKEN:
      return tokenDefault;
    default:
      return state;
  }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case SET_FETCHING: 
          return action.state;
        default: 
          return state;
  }
}

function isAuthenticated(state = false, action) {
    switch (action.type) {
        case SET_AUTH: 
          return action.state;
        default: 
          return state;
  }
}

function persistedState() {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) return null
    return JSON.parse(serializedState)
  } catch(e) {
    return null
  }
}

const persistedStates = persistedState == null ? persistDefault : persistedState;

export default combineReducers({
    user,
    token,
    isFetching,
    isAuthenticated,
    persistedStates,
    form: formReducer
});
import axios from 'axios'
export const SET_FETCHING = 'SET_FETCHING';
export const SET_TOKEN= 'SET_TOKEN';
export const DELETE_TOKEN = 'DELETE_TOKEN';
export const SET_USER = 'SET_USER';
export const DELETE_USER = 'DELETE_USER';
export const SET_AUTH = 'SET_AUTH';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";


export function setFetching(v) {
  return { type: SET_FETCHING, state: v };
}

export function setUser(user) {
  return { type: SET_USER, user };
}

export function setAuthenticated(auth) {
  return { type: SET_AUTH, state: auth };
}

export function setToken(token) {
  return { type: SET_TOKEN , token };
}

export function deleteUser() {
  return { type: DELETE_USER };
}

export function deleteToken() {
  return { type: DELETE_TOKEN };
}

export function actionCheckExpired(values) {
   return dispatch => {
     axios.get("https://kbli-rest.herokuapp.com/profile/", {
        headers: {
          'Authorization': `${values}`,
          'Secret' : '4sri',
        }
      })
        .then(response => response.data)
        .then(json => {

            if(json.status !== 'on'){
                localStorage.clear();
                dispatch(deleteUser());
                dispatch(deleteToken());
                dispatch(setAuthenticated(false));
            }
        });
    }
  };

export function actionGetUsername(values) {
   return dispatch => {
     axios.post("https://kbli-rest.herokuapp.com/getUser/",{ email : values.email }, {
        headers: {
          'Authorization': `Bearer ${values.token}`,
        }
      })
        .then(response => response.data)
        .then(json => {
           dispatch(setUser(json.user));
           localStorage.setItem("user", JSON.stringify(json.user));
           dispatch(setFetching(false));
           dispatch(setAuthenticated(true));
        });
    }
  };

export function actionTryLogin(values) {
    return dispatch => {
    dispatch(setFetching(true));
    axios.post('https://kbli-rest.herokuapp.com/login/', values)
    .then(response => response.data)
    .then(data => {
      const token = data;
      if (token !== null) {
        dispatch(setToken({ token : token.token}));
        dispatch(actionGetUsername(token));
        localStorage.setItem("token", JSON.stringify({token : token.token}));
      }
    })
    .catch(err => {
      dispatch(setFetching(false));
      dispatch(setAuthenticated(false));
    });
  };
}


import React, { Component } from 'react';
// import { renderRoutes } from 'react-router-config';
import './App.scss';
import { Provider } from 'react-redux';
import Routes from './utils/Route';
import { store, persistor } from './utils/Store';  
import { PersistGate } from 'redux-persist/integration/react';
require('dotenv').config()
// const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// // Containers
// const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// // Pages
// const Login = React.lazy(() => import('./views/Pages/Login'));
// const Register = React.lazy(() => import('./views/Pages/Register'));
// const Page404 = React.lazy(() => import('./views/Pages/Page404'));
// const Page500 = React.lazy(() => import('./views/Pages/Page500'));

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;

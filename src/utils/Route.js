import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter , BrowserRouter , Route , Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import {PrivateRoute}  from './PrivateRoute';
import ErrorBoundary  from './ErrorBoundary';
import routes from '../routes';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

const DefaultLayout = Loadable({
  loader: () => import('../containers/DefaultLayout'),
  loading
});

const Register = Loadable({
  loader: () => import('../views/Pages/Register'),
  loading
});

const Login = Loadable({
  loader: () => import('../views/Pages/Login/Login'),
  loading
});

class Routes extends Component {
  render() {
    const authenticated = this.props.authenticated;
    console.log(authenticated)
    return (
          <BrowserRouter>
              <HashRouter>
               <React.Suspense fallback={loading()}>
                  <Switch>
                      <Route exact path="/" component={Login} />
                      <Route path="/login" component={Login} />
                      <Route path="/register" component={Register} />
                      {routes.map((route, idx) => {
                        return route.component ? (
                          <PrivateRoute
                            authed={authenticated}
                            key={idx}
                            path={route.path}
                            exact={route.exact}
                            name={route.name}
                            component={props => (
                                <route.component {...props} />
                            )} />
                        ) : (null);
                        })}
                  </Switch>
                </React.Suspense>
              </HashRouter>
          </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({ authenticated : state.isAuthenticated, isFetching : state.isFetching });
export default connect(mapStateToProps, null)(Routes);
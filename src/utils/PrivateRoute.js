import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import DefaultLayout from '../containers/DefaultLayout';
export const PrivateRoute = ({component: Component, authed, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            authed ?
                <DefaultLayout><Component {...props} /></DefaultLayout>
            : <Redirect to="/login" />
        )} />
    );
};


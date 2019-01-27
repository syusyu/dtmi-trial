import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import Error from './Error';
import Login from './Login';
import Home from './Home';
import { withAuthenticator } from "aws-amplify-react";

const WithAuth = withAuthenticator(
    ({ match }) => (
        <Switch>
            <Route path={match.url} exact component={Home} />
            <Route component={Error} />
        </Switch>
    ),
    false,
    [<Login />]
);

const HomeWithAuth = props => {
    return <WithAuth {...props} />;
};

export default HomeWithAuth;

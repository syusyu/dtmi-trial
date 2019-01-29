import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import Error from './Error';
import Login from './Login';
import Home from './Home';
import { withAuthenticator } from "aws-amplify-react";

const WithAuth = withAuthenticator(
    (props) => {
        return <Switch>
            <Route path={props.match.url} exact render={e => <Home {...props} />} />
        </Switch>
    }
    ,
    false,
    [<Login />]
);

const HomeWithAuth = props => {
    return <WithAuth {...props} />;
};

export default HomeWithAuth;

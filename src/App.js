import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from './Login';
import HomeWithAuth from './HomeWithAuth';
import IDPCallback from './IDPCallback';
import Amplify from "aws-amplify/lib/index";

Amplify.configure({
    Auth: {
        // identityPoolId: 'us-east-2:7635a46e-4cec-4e97-96fc-40824a1ab117',
        region: CONFIG.COGNITO_REGION,
        userPoolId: CONFIG.COGNITO_USER_POOL_ID,
        userPoolWebClientId: CONFIG.COGNITO_CLIENT_ID
    }
});

class App extends Component {
  render() {
    return (
        <Router>
            <Switch>
                <Route path="/idpresponse" exact component={IDPCallback} />
                <Route path="/login" exact component={Login} />
                <Route path="/" exact component={HomeWithAuth} />
            </Switch>
        </Router>
    );
  }
}

export default App;



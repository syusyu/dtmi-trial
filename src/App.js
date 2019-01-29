import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from './Login';
import HomeWithAuth from './HomeWithAuth';
import IDPCallback from './IDPCallback';
import AuthRequired from './AuthRequired';
import Amplify, { Auth } from "aws-amplify";
import {createUser, fetchUser, persistUser} from "./userInfo"


Amplify.configure({
    Auth: {
        region: CONFIG.COGNITO_REGION,
        userPoolId: CONFIG.COGNITO_USER_POOL_ID,
        userPoolWebClientId: CONFIG.COGNITO_CLIENT_ID
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        const cognitoUser = Auth.userPool.getCurrentUser();
        this.state = {
            authenticated: Boolean(cognitoUser),
            user: this.prepareUser(cognitoUser)
        }
    }

    prepareUser(cognitoUser) {
        if (!cognitoUser) {
            return null;
        }
        const existingUser = fetchUser(cognitoUser.username)
        if (existingUser) {
            return existingUser
        } else {
            const newUser = createUser(cognitoUser.username)
            this.updateUser(newUser)
            return newUser
        }
    }

    updateUser(user) {
        persistUser(user)
    }

    setNotifyTokenToUser(notifyToken) {
        console.log(`setNotifyTokenToUser is called. token=${notifyToken}`)
        let user = this.state.user
        user.setNotifyToken(notifyToken)
        this.setState({
            user: user
        })
    }

    render() {
        console.log(`App.authenticated=${this.state.authenticated}`)
        return (
            <Router>
                <Switch>
                    {/*<Route path="/idpresponse" exact render={props => <IDPCallback authenticate={this.authenticate} {...props} />} />*/}
                    <Route path="/idpresponse" exact component={IDPCallback} />
                    <Route path="/login" exact component={Login}/>
                    <AuthRequired authenticated={this.state.authenticated}>
                        {/*<Route path="/" exact component={HomeWithAuth}/>*/}
                        <Route path="/" exact render={props => <HomeWithAuth user={this.state.user} setNotifyTokenToUser={e => this.setNotifyTokenToUser(e)} {...props} />} />
                    </AuthRequired>
                </Switch>
            </Router>
        );
    }
}

export default App;



import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from './Login';
import HomeWithAuth from './HomeWithAuth';
import IDPCallback from './IDPCallback';
import LineNotifyAuth from './LineNotifyAuth';
import LineNotifyAuthCallback from './LineNotifyAuthCallback';
import AuthLineRequired from './AuthLineRequired';
import AuthCognitoRequired from './AuthCognitoRequired';
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
        const cognitoUser = Auth.userPool ? Auth.userPool.getCurrentUser() : null;
        this.state = {
            authenticated: Boolean(cognitoUser),
            user: this.loadUser(cognitoUser)
        }
        console.log('APP created...')
    }

    loadUser(cognitoUser) {
        if (!cognitoUser) {
            return null;
        }

        const memberUser = fetchUser(cognitoUser.username)
        if (memberUser) {
            return memberUser;
        } else {
            console.error(`User should be registered username=${cognitoUser.username}`)
            return createUser(cognitoUser.username) //Call this method as safety net but actually shouldn't be called.
        }
    }

    /**
     * This is called by callback function of cognito oauth
     */
    initializeUser(userId) {
        this.setState({user: createUser(userId)})
    }

    /**
     * This is called by callback function of LINE oauth
     */
    setNotifyTokenToUser(notifyToken) {
        console.log(`setNotifyTokenToUser is called. token=${notifyToken}`)
        const user = this.state.user
        user.setNotifyToken(notifyToken)
        this.setState({
            user: user
        })
    }

    hasNotifyToken() {
        return Boolean(this.state.user) && Boolean(this.state.user.notifyToken)
    }

    render() {
        // console.log(`App.authenticated=${this.state.authenticated}`)
        return (
            <Router>
                <Switch>
                    <Route path="/idpresponse" exact render={props => <IDPCallback initializeUser={e => this.initializeUser(e)} {...props} />} />
                    <Route path="/login" exact component={Login}/>
                    <AuthCognitoRequired authenticated={this.state.authenticated}>
                        <Route path="/line-notify-auth" exact component={LineNotifyAuth} />
                        <Route path="/line-auth-response" exact render={props => <LineNotifyAuthCallback setNotifyTokenToUser={e => this.setNotifyTokenToUser(e)} {...props} />} />
                        {/*<AuthLineRequired authenticated={this.state.authenticated} hasNotifyToken={() => this.hasNotifyToken()}>*/}
                            <Route path="/" exact render={props => <HomeWithAuth user={this.state.user}  setNotifyTokenToUser={e => this.setNotifyTokenToUser(e)} {...props} />} />
                        {/*</AuthLineRequired>*/}
                    </AuthCognitoRequired>
                </Switch>
            </Router>
        );
    }
}

export default App;



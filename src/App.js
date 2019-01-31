import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from './Login';
import HomeWithAuth from './HomeWithAuth';
import IDPCallback from './IDPCallback';
import LineNotifyAuthCallback from './LineNotifyAuthCallback';
import LineNotifyTokenCallback from './LineNotifyTokenCallback';
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
        const cognitoUser = Auth.userPool ? Auth.userPool.getCurrentUser() : null;
        this.state = {
            authenticated: Boolean(cognitoUser),
            user: this.loadUser(cognitoUser)
        }
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

    render() {
        // console.log(`App.authenticated=${this.state.authenticated}`)
        return (
            <Router>
                <Switch>
                    <Route path="/idpresponse" exact render={props => <IDPCallback initializeUser={e => this.initializeUser(e)} {...props} />} />
                    {/*<Route path="/idpresponse" exact component={IDPCallback} />*/}
                    <Route path="/login" exact component={Login}/>
                    <AuthRequired authenticated={this.state.authenticated}>
                        {/*<Route path="/" exact component={HomeWithAuth}/>*/}
                        <Route path="/" exact render={props => <HomeWithAuth user={this.state.user} setNotifyTokenToUser={e => this.setNotifyTokenToUser(e)} {...props} />} />
                        <Route path="/line-auth-response" exact render={props => <LineNotifyAuthCallback setNotifyTokenToUser={e => this.setNotifyTokenToUser(e)} {...props} />} />
                        {/*<Route path="/line-auth-response" exact component={LineNotifyAuthCallback} />*/}
                        {/*<Route path="/line-token-response" exact component={LineNotifyTokenCallback} />*/}
                        {/*<Route path="/line-token-response" exact render={props => <LineNotifyTokenCallback setNotifyTokenToUser={e => this.setNotifyTokenToUser(e)} {...props} />} />*/}
                    </AuthRequired>
                </Switch>
            </Router>
        );
    }
}

export default App;



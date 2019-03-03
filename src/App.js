import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from './Login';
import Error from './Error'
import HomeWithAuth from './HomeWithAuth';
import IDPCallback from './IDPCallback';
import LineNotifyAuth from './LineNotifyAuth';
import LineNotifyAuthCallback from './LineNotifyAuthCallback';
import AuthCognitoRequired from './AuthCognitoRequired';
import Amplify, {Auth} from "aws-amplify";
import {createUserDB, fetchUserDB, updateUserNotifyTokenDB, updateUserSearchWordsDB, User, deleteUserFromStorage} from "./userInfo"
import {awsAppSync, generateAuth, establishAuthSession} from "./awsConfig"


Amplify.configure({
    Auth: {
        region: CONFIG.COGNITO_REGION,
        userPoolId: CONFIG.COGNITO_USER_POOL_ID,
        userPoolWebClientId: CONFIG.COGNITO_CLIENT_ID,
        identityPoolId: CONFIG.COGNITO_IDENTITY_POOL_ID,
    },
    ...awsAppSync
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: Auth.userPool && Auth.userPool.getCurrentUser(),
            user: null
        }
    }

    async componentDidMount() {
        const cognitoUser = Auth.userPool ? Auth.userPool.getCurrentUser() : null;
        console.log(`App.componentDidMount=cognitoUser=${Boolean(cognitoUser)}, auth=${Boolean(cognitoUser)}`)

        if (cognitoUser) {
            // establishAuthSession(cognitoUser)
            const memberUser = await fetchUserDB(cognitoUser.username)
            this.setState({user: memberUser})
        }

        console.log(`App.componentDidMount.fetched.user=${JSON.stringify(this.state.user)}`)
    }

    hasNotifyToken() {
        return Boolean(this.state.user) && Boolean(this.state.user.notifyToken)
    }

    /**
     * This is called by callback function of LINE oauth
     */
    async updateNotifyToken(notifyToken) {
        const cognitoUser = Auth.userPool.getCurrentUser()
        let user = await fetchUserDB(cognitoUser.username)
        user = await updateUserNotifyTokenDB(this.state.user, notifyToken)
        this.setState({
            user: user
        })
        console.log(`updateNotifyToken is succeeded. user=${JSON.stringify(user)}`)
    }

    async updateSearchWords(searchWords) {
        // let user = this.state.user
        const user = await updateUserSearchWordsDB(this.state.user, searchWords)
        this.setState({
            user: user
        })
        console.log(`updateSearchWords is succeeded. user=${JSON.stringify(user)}`)
    }

    render() {
        // console.log(`App.authenticated=${this.state.authenticated}`)
        return (
            <Router>
                <Switch>
                    <Route path="/idpresponse" exact
                           render={props => <IDPCallback createUser={e => this.createUser(e)} {...props} />}/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/error" exact component={Error}/>
                    <AuthCognitoRequired authenticated={this.state.authenticated}>
                        <Route path="/line-notify-auth" exact component={LineNotifyAuth}/>
                        <Route path="/line-auth-response" exact render={props => <LineNotifyAuthCallback
                            updateNotifyToken={e => this.updateNotifyToken(e)} {...props} />}/>
                        <Route path="/" exact render={props => <HomeWithAuth user={this.state.user}
                            updateSearchWords={e => this.updateSearchWords(e)} {...props} />}/>
                    </AuthCognitoRequired>
                </Switch>
            </Router>
        );
    }
}

export default App;



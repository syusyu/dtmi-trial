import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from './Login';
import HomeWithAuth from './HomeWithAuth';
import IDPCallback from './IDPCallback';
import LineNotifyAuth from './LineNotifyAuth';
import LineNotifyAuthCallback from './LineNotifyAuthCallback';
import AuthCognitoRequired from './AuthCognitoRequired';
import Amplify, {Auth} from "aws-amplify";
import {createUserDB, fetchUserDB, updateUserNotifyTokenDB, updateUserSearchWordsDB, User} from "./userInfo"
import {awsAppSync} from "./awsConfig"


Amplify.configure({
    Auth: {
        region: CONFIG.COGNITO_REGION,
        userPoolId: CONFIG.COGNITO_USER_POOL_ID,
        userPoolWebClientId: CONFIG.COGNITO_CLIENT_ID
    },
    ...awsAppSync
});

class App extends Component {
    constructor(props) {
        super(props);
        const cognitoUser = Auth.userPool ? Auth.userPool.getCurrentUser() : null;
        this.state = {
            cognitoUser: cognitoUser,
            authenticated: Boolean(cognitoUser),
            user: null
        }
        console.log('APP created...')
    }

    async componentDidMount() {
        const cognitoUser = this.state.cognitoUser
        if (!cognitoUser) {
            return null;
        }

        let memberUser = await fetchUserDB(cognitoUser.username)
        if (memberUser == null) {
            console.error(`User should be registered username=${cognitoUser.username}`)
            memberUser = createUserDB(cognitoUser.username) //Call this method as safety net but actually shouldn't be called.
        }
        this.setState({user: memberUser})
        console.log(`App.componentDidMount.fetched.user=${JSON.stringify(memberUser)}`)
    }

    /**
     * This is called by callback function of cognito oauth
     */
    async createUser(userId, onSuccess, onError) {
        console.log(`createUserDB is called. userId=${userId}`)
        const user = new User(userId)
        await createUserDB(user)
        this.setState({user: user})
    }

    /**
     * This is called by callback function of LINE oauth
     */
    async updateNotifyToken(notifyToken) {
        console.log(`updateNotifyToken is called. token=${notifyToken}`)
        let user = this.state.user
        if (!user) {
            user = await fetchUserDB(this.state.cognitoUser.username)
        }
        user = await updateUserNotifyTokenDB(this.state.user, notifyToken)
        this.setState({
            user: user
        })
        console.log(`updateNotifyToken is succeeded. user=${JSON.stringify(user)}`)
    }

    hasNotifyToken() {
        return Boolean(this.state.user) && Boolean(this.state.user.notifyToken)
    }

    async updateSearchWords(searchWords) {
        console.log(`updateSearchWords is called. searchWords=${searchWords}`)
        let user = this.state.user
        user = await updateUserSearchWordsDB(this.state.user, searchWords)
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



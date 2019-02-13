import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from './Login';
import HomeWithAuth from './HomeWithAuth';
import IDPCallback from './IDPCallback';
import LineNotifyAuth from './LineNotifyAuth';
import LineNotifyAuthCallback from './LineNotifyAuthCallback';
import AuthLineRequired from './AuthLineRequired';
import AuthCognitoRequired from './AuthCognitoRequired';
import Amplify, {Auth} from "aws-amplify";
import {createUser, fetchUser, updateUser, User} from "./userInfo"


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
            cognitoUser: cognitoUser,
            authenticated: Boolean(cognitoUser),
            user: null
        }
        console.log('APP created...')
    }

    componentDidMount() {
        const cognitoUser = this.state.cognitoUser
        if (!cognitoUser) {
            return null;
        }

        fetchUser(cognitoUser.username).then(data => {
            let memberUser = data;
            if (memberUser == null) {
                console.error(`User should be registered username=${cognitoUser.username}`)
                memberUser = createUser(cognitoUser.username) //Call this method as safety net but actually shouldn't be called.
            }
            this.setState({user: memberUser})
            console.log(`App.componentDidMount.user2=${JSON.stringify(memberUser)}`)
        })
    }

    /**
     * This is called by callback function of cognito oauth
     */
    async createUserDB(userId, onSuccess, onError) {
        console.log(`createUserDB is called. userId=${userId}`)
        const user = new User(userId)
        await createUser(user)
        this.setState({user: user})
    }

    /**
     * This is called by callback function of LINE oauth
     */
    async setNotifyTokenToUserDB(notifyToken) {
        console.log(`setNotifyTokenToUser is called. token=${notifyToken}`)
        const user = this.state.user
        user.setNotifyToken(notifyToken)
        await updateUser(user)
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
                    <Route path="/idpresponse" exact
                           render={props => <IDPCallback createUserDB={e => this.createUserDB(e)} {...props} />}/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/error" exact component={Error}/>
                    <AuthCognitoRequired authenticated={this.state.authenticated}>
                        <Route path="/line-notify-auth" exact component={LineNotifyAuth}/>
                        <Route path="/line-auth-response" exact render={props => <LineNotifyAuthCallback
                            setNotifyTokenToUserDB={e => this.setNotifyTokenToUserDB(e)} {...props} />}/>
                        {/*<AuthLineRequired authenticated={this.state.authenticated} hasNotifyToken={() => this.hasNotifyToken()}>*/}
                        <Route path="/" exact render={props => <HomeWithAuth user={this.state.user}
                                                                             setNotifyTokenToUserDB={e => this.setNotifyTokenToUserDB(e)} {...props} />}/>
                        {/*</AuthLineRequired>*/}
                    </AuthCognitoRequired>
                </Switch>
            </Router>
        );
    }
}

export default App;



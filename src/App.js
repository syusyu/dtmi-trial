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
import {fetchUserDB, updateUserNotifyTokenDB, updateUserSearchWordsDB, User, subscribeUserPrograms, scrapePrograms} from "./userInfo"
import {awsAppSync, awsApi} from "./awsConfig"


Amplify.configure({
    Auth: {
        region: CONFIG.COGNITO_REGION,
        userPoolId: CONFIG.COGNITO_USER_POOL_ID,
        userPoolWebClientId: CONFIG.COGNITO_CLIENT_ID,
        identityPoolId: CONFIG.COGNITO_IDENTITY_POOL_ID,
    },
    API: {
        ...awsAppSync,
        ...awsApi,
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cognitoUser: Auth.userPool ? Auth.userPool.getCurrentUser() : null,
            authenticated: Auth.userPool && Auth.userPool.getCurrentUser(),
            user: null,
            subscription: null
        }
        this.updatePrograms = this.updatePrograms.bind(this)
    }

    async componentDidMount() {
        if (this.state.cognitoUser) {
            const memberUser = await fetchUserDB(this.state.cognitoUser.username)
            const subscription = await subscribeUserPrograms(memberUser, this.updatePrograms)
            this.setState({
                user: memberUser,
                subscription: subscription
            })
        }
        // console.log(`App.componentDidMount.fetched.user=${JSON.stringify(this.state.user)}`)
    }

    componentWillUnmount() {
        console.log((`App.componentWillUnmount`))
        this.state.subscription.unsubscribe()
    }

    hasNotifyToken() {
        return Boolean(this.state.user && this.state.user.notifyToken)
    }

    /**
     * This is called by callback function of LINE oauth
     */
    async updateNotifyToken(notifyToken) {
        let user = await fetchUserDB(this.state.cognitoUser.username)
        user = await updateUserNotifyTokenDB(user, notifyToken)
        this.setState({
            user: user
        })
        // console.log(`updateNotifyToken is succeeded. user=${JSON.stringify(user)}`)
    }

    async updateSearchWords(searchWords) {
        const user = await updateUserSearchWordsDB(this.state.user, searchWords)
        this.setState({
            user: user
        })
        console.log(`updateSearchWords is succeeded. user=${user.userId}`)
        await scrapePrograms(user)
    }

    updatePrograms(programs) {
        // console.log(`App.updatePrograms.programs=${JSON.stringify(programs)}`)
        let user = this.state.user
        user.programs = programs
        this.setState({
            user: user
        })
        // console.log(`App.updatePrograms.programs=${JSON.stringify(this.state.user.programs)}`)
    }

    signOut() {
        this.state.cognitoUser.signOut()
        this.setState({
            cognitoUser:null,
            user:null,
            authenticated: false
        })
    }

    render() {
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
                            updateSearchWords={e => this.updateSearchWords(e)} signOut={() => this.signOut()} {...props} />}/>
                    </AuthCognitoRequired>
                </Switch>
            </Router>
        );
    }
}

export default App;



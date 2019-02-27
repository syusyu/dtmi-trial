import React, {Component} from "react";
import {CognitoAuth} from "amazon-cognito-auth-js/dist/amazon-cognito-auth";
import {generateAuth} from "./awsConfig";
import { Auth } from "aws-amplify";
import { Redirect } from 'react-router-dom'


class IDPCallback extends Component {

    constructor(props) {
        super(props);
        this.state = {
            needRedirect: false,
            path: ''
        }
        this.onSuccessFunc = this.onSuccessFunc.bind(this)
        this.onFailureFunc = this.onFailureFunc.bind(this)
    }

    componentDidMount() {
        const auth = generateAuth(this.onSuccessFunc, this.onFailureFunc);
        auth.parseCognitoWebResponse(this.props.location.search);
    }

    onSuccessFunc(result) {
        console.log(`onSuccess.result=${JSON.stringify(result)}`)
        // const userId = Auth.userPool.getCurrentUser().username
        // this.props.createUser(userId)
        // this.invokeRedirect('/')
    }

    onFailureFunc(err) {
        console.error(`IDPCallback failure. err=${JSON.stringify(err)}`)
        this.invokeRedirect('/error')
    }

    invokeRedirect(path) {
        this.setState({
            needRedirect: true,
            path: path
        });
    }

    render() {
        const temporallyComponent = (<div>Redirecting...</div>)
        if (this.state.needRedirect) {
            if (this.state.path == '/') {
                window.location.assign(CONFIG.APP_ROOT_URL);
                return temporallyComponent;
            } else {
                return <Redirect to={this.state.path} />
            }
        }
        return temporallyComponent;
    }
}

export default IDPCallback;

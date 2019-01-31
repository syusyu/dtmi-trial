import React, {Component} from "react";
import {CognitoAuth} from "amazon-cognito-auth-js/dist/amazon-cognito-auth";
import {generateAuth} from "./awsConfig";
import { Auth } from "aws-amplify";


class IDPCallback extends Component {

    constructor(props) {
        super(props);
        this.state = {
            needRedirect: false
        }
        this.onSuccessFunc = this.onSuccessFunc.bind(this)
        this.onFailureFunc = this.onFailureFunc.bind(this)
    }

    componentDidMount() {
        const auth = generateAuth(this.onSuccessFunc, this.onFailureFunc);
        auth.parseCognitoWebResponse(this.props.location.search);
    }

    onSuccessFunc(result) {
        const userId = Auth.userPool.getCurrentUser().username
        this.props.initializeUser(userId);
        this.invokeRedirect()
    }

    onFailureFunc(err) {
        console.error(`IDPCallback failure. err=${JSON.stringify(err)}`)
        this.invokeRedirect()
    }

    invokeRedirect() {
        this.setState({needRedirect: true});
    }

    render() {
        const temporallyComponent = (<div>Redirecting...</div>)

        if (this.state.needRedirect) {
            window.location.assign(CONFIG.APP_ROOT_URL);
            return temporallyComponent;
        }
        return temporallyComponent;
    }
}

export default IDPCallback;

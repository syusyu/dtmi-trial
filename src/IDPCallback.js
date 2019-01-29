import React, {Component} from "react";
import {CognitoAuth} from "amazon-cognito-auth-js/dist/amazon-cognito-auth";
import {generateAuth} from "./awsConfig";
import {Redirect} from "react-router-dom";


class IDPCallback extends Component {

    constructor(props) {
        console.log(`IDPCallback constructor=${JSON.stringify(props)}`)
        super(props);
        this.state = {
            needRedirect: false,
            redirectPath: "/"
        }
        this.onSuccessFunc = this.onSuccessFunc.bind(this)
        this.onFailureFunc = this.onFailureFunc.bind(this)
    }

    componentDidMount() {
        const auth = generateAuth(this.onSuccessFunc, this.onFailureFunc);
        auth.parseCognitoWebResponse(this.props.location.search);
    }

    onSuccessFunc() {
        this.invokeRedirect("/")
    }

    onFailureFunc() {
        console.error('IDPCallback failure')
        this.invokeRedirect("/")
    }

    invokeRedirect(path) {
        this.setState({needRedirect: true, redirectPath: path});
    }

    render() {
        const temporallyComponent = (<div>Redirecting...</div>)

        if (this.state.needRedirect) {
            window.location.assign(CONFIG.APP_ROOT_URL + this.state.redirectPath);
            return temporallyComponent;
            // return <Redirect to={this.state.redirectPath} />
        }
        return temporallyComponent;
    }
}

export default IDPCallback;

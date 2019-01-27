import React, { Component } from "react";
import { CognitoAuth } from "amazon-cognito-auth-js/dist/amazon-cognito-auth";
import { generateAuth} from "./awsConfig";
import { Redirect } from "react-router-dom";
// import dotenv from 'dotenv';

// const env = process.env;


class IDPCallback extends Component {

    constructor(props) {
        super(props);
        this.state = {
            needRedirect: false,
            redirectPath: "/"
        }
    }

    componentDidMount() {
        const auth = generateAuth(this.invokeRedirect("/idpresponse"), this.invokeRedirect("/"));
        auth.parseCognitoWebResponse(this.props.location.search);
    }

    invokeRedirect(path) {
        this.setState({ needRedirect: true, redirectPath: path });
    }

    render() {
        if (this.state.needRedirect) {
            return <Redirect to={this.state.redirectPath} />
        }
        return (
            <div className="IDP">
                <div className="lander">
                    <h1>IDP Callback</h1>
                </div>
            </div>
        );
    }
}
export default IDPCallback;

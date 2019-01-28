import React, { Component } from "react";
import { CognitoAuth } from "amazon-cognito-auth-js/dist/amazon-cognito-auth";
import { generateAuth} from "./awsConfig";
import { Redirect } from "react-router-dom";


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
        const temporallyComponent =
            <div>
                Redirecting...
            </div>

        if (this.state.needRedirect) {
            window.location.assign(CONFIG.APP_ROOT_URL + this.state.redirectPath);
            return temporallyComponent;
            // return <Redirect to={this.state.redirectPath} />
        }
        return temporallyComponent;
    }
}
export default IDPCallback;

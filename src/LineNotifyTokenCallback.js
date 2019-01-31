import React, {Component} from "react";
import {Redirect} from "react-router-dom";


class LineNotifyTokenCallback extends Component {

    constructor(props) {
        super(props);
        this.state = {
            needRedirect: false
        }

        // console.log(`LineNotifyTokenCallback.props=${JSON.stringify(props)}`)
    }

    componentDidMount() {
        //TODO error handling or retrieve access token by more solid way
        let code = this.props.location.search.substr(1).split('&')[0].split('=')[1]
        this.props.setNotifyTokenToUser(code)
        this.invokeRedirect()
    }

    invokeRedirect() {
        this.setState({needRedirect: true});
    }

    render() {
        const temporallyComponent = (<div>Redirecting(LINE token)...</div>)

        if (this.state.needRedirect) {
            // window.location.assign(CONFIG.APP_ROOT_URL + this.state.redirectPath);
            // return temporallyComponent;
            return <Redirect to={"/"} />
        }
        return temporallyComponent;
    }
}

export default LineNotifyTokenCallback;

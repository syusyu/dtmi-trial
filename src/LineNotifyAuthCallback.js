import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"


class LineNotifyAuthCallback extends Component {

    constructor(props) {
        super(props);
        this.state = {
            needRedirect: false
        }
        console.log(`LineNotifyAuthCallback.props=${JSON.stringify(props)}`)
    }

    componentDidMount() {
        //TODO error handling or retrieve code by more solid way
        const code = this.props.location.search.substr(1).split('&')[0].split('=')[1]

        let params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', CONFIG.LINE_REDIRECT_AUTH_URI);
        params.append('client_id', CONFIG.LINE_CLIENT_ID);
        params.append('client_secret', CONFIG.LINE_CLIENT_SECRET);
        //
        // const headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        try {
            axios({
                url: 'https://localhost:3002/line-notify-token',
                method: 'POST',
                data: params
            }).then((result) => {
                console.log(`api.res=${JSON.stringify(result)}`)
                this.props.setNotifyTokenToUser(result.data.access_token)
                this.invokeRedirect()
            })
        } catch (err) {
            console.error(err)
        }
    }

    invokeRedirect() {
        this.setState({needRedirect: true});
    }

    render() {
        return this.state.needRedirect ? <Redirect to={"/"}/> : <div>Redirecting(LINE token)...</div>
    }
}

export default LineNotifyAuthCallback;

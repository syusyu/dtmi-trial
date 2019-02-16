import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"


class LineNotifyAuthCallback extends Component {

    constructor(props) {
        super(props);
        this.state = {
            needRedirect: false
        }
    }

    async componentDidMount() {
        //TODO error handling or retrieve code by more solid way
        const code = this.props.location.search.substr(1).split('&')[0].split('=')[1]
        console.log(`LineNotifyAuthCallback.componendDidMount.code=${code}`)

        let params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', CONFIG.LINE_REDIRECT_AUTH_URI);
        params.append('client_id', CONFIG.LINE_CLIENT_ID);
        params.append('client_secret', CONFIG.LINE_CLIENT_SECRET);

        try {
            const result = await axios({
                url: 'https://localhost:3002/line-notify-token',
                method: 'POST',
                data: params
            })
            console.log(`LineNotifyAuthCallback.api.res=${JSON.stringify(result)}`)
            const notifyRes = await this.props.updateNotifyToken(result.data.access_token)
            this.invokeRedirect()
        } catch (err) {
            console.error(err)
        }

    }

    invokeRedirect() {
        this.setState({needRedirect: true});
    }

    render() {
        // return (<div>TEmporarrly stopping</div>)
        return this.state.needRedirect ? <Redirect to={"/"}/> : <div>Redirecting(LINE token)...</div>
    }
}

export default LineNotifyAuthCallback;

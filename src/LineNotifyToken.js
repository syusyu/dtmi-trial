import React, { Component } from 'react';

class LineNotifyToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null
        }
    }
    callTokenAPI() {
        this.setState({ token: 'adfaraeripiopoiudxfa;erf' });
        this.props.setNotifyTokenToUser('xxx')
    }
    render() {
        const token = this.state.token;
        const clientId = CONFIG.LINE_CLIENT_ID;
        const redirectUrl = CONFIG.LINE_REDIRECT_URI;
        const state = 'xxxxxxxxxxxxx';
        const url = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=notify&state=${state}`;
        return (
            <div>
                {token ? token : <button onClick={(e) => this.callTokenAPI(e)}>Get token</button>}
                {/*<a href={url}>Login with LINE</a>*/}
            </div>
        );
    }
}

export default LineNotifyToken;



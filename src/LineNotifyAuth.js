import React, { Component } from 'react';

class LineNotifyToken extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const temporallyComponent = (<div>Redirecting...LINE Auth...</div>)

        const clientId = CONFIG.LINE_CLIENT_ID;
        const redirectUrl = CONFIG.LINE_REDIRECT_AUTH_URI;
        const state = 'xxxxxxxxxxxxx';
        const url = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=notify&state=${state}`;
        window.location.assign(url);
        return temporallyComponent;
    }
}

export default LineNotifyToken;



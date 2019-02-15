import React, { Component } from 'react';

class LineNotifyToken extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const clientId = CONFIG.LINE_CLIENT_ID;
        const redirectUrl = CONFIG.LINE_REDIRECT_AUTH_URI;
        const state = 'xxxxxxxxxxxxx';
        const url = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=notify&state=${state}`;
        return (
            <div>
                <a href={url}>Get token of LINE Notify</a>
                <br />
            </div>
        );
    }
}

export default LineNotifyToken;



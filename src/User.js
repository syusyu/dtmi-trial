import React, { Component } from 'react';
import SearchWord from "./SearchWord"
import Program from "./Program"

export default class User extends Component {
    render() {
        // console.log(`User.props.user=${JSON.stringify(this.props.user)}`)

        const userLoaded = Boolean(this.props.user && this.props.user.userId)
        const hasNotifyToken = Boolean(userLoaded && this.props.user.notifyToken)

        const clientId = CONFIG.LINE_CLIENT_ID;
        const redirectUrl = CONFIG.LINE_REDIRECT_AUTH_URI;
        const state = 'xxxxxxxxxxxxx';
        const url = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=notify&state=${state}`;

        const notifyToken = hasNotifyToken ?
            <div>
                <p>lineNotifyToken: {this.props.user.notifyToken}</p>
                <SearchWord {...this.props} />
                <Program {...this.props} />
            </div> :
            <a href={url}>Get token of LINE Notify</a>

        return userLoaded ?
            <div>
                <p>userId: {this.props.user.userId}</p>
                {notifyToken}

            </div>
            :
            <p>loading user</p>
    }
}

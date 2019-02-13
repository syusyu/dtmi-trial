import React, { Component } from 'react';

export default class User extends Component {
    render() {
        const userLoaded = Boolean(this.props.user && this.props.user.userId)
        return userLoaded ?
            <div>
                <p>userId: {this.props.user.userId}</p>
                <p>lineNotifyToken: {this.props.user.notifyToken}</p>
            </div>
            :
            <p>loading user</p>
    }
}

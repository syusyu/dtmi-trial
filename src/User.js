import React, { Component } from 'react';

export default class User extends Component {
    render() {
        return (
            <div>
                <p>userId: {this.props.user.userId}</p>
                <p>lineNotifyToken: {this.props.user.notifyToken}</p>
            </div>
        );
    }
}

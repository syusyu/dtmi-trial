import React, { Component } from 'react';
import User from "./User"



export default class Home extends Component {
    render() {
        return (
            <div>
                <p>This is Home</p>

                <button onClick={() => this.props.signOut()}>
                    Sign out
                </button>

                <User {...this.props}/>
            </div>
        );
    }
}

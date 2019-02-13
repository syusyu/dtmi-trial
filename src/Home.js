import React, { Component } from 'react';
import { generateAuth} from "./awsConfig";
import LineNotifyToken from "./LineNotifyToken"
import User from "./User"

const signOut = async () => {
    const auth = generateAuth();
    await auth.signOut();
}

export default class Home extends Component {
    render() {
        return (
            <div>
                <p>This is Home</p>
                <button onClick={signOut}>
                    Sign out
                </button>
                <LineNotifyToken setNotifyTokenToUserDB={e => this.props.setNotifyTokenToUserDB(e)}/>
                <User user={this.props.user}/>
            </div>
        );
    }
}

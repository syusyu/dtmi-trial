import React, { Component } from 'react';
import { generateAuth} from "./awsConfig";
import User from "./User"
import Program from "./Program"

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
                <User user={this.props.user}/>
                <Program user={this.props.user}/>
            </div>
        );
    }
}

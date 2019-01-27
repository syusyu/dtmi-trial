import React, { Component } from 'react';
import Amplify, { Auth } from "aws-amplify";
import { generateAuth} from "./awsConfig";


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
            </div>
        );
    }
}

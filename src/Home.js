import React, { Component } from 'react';
import { generateAuth} from "./awsConfig";
import User from "./User"
import Amplify, {Auth} from "aws-amplify";



export default class Home extends Component {
    signOut() {
        // const auth = generateAuth();
        // await auth.signOut();
        Auth.getCurrentUser().signOut();
        console.log('SIGN-OUT!!!')
    }

    constructor(props) {
        super(props)
        console.log(`HOME.user=${JSON.stringify(props.user)}`)
    }

    render() {
        return (
            <div>
                <p>This is Home</p>

                <button onClick={() => this.signOut()}>
                    Sign out
                </button>

                <User {...this.props}/>
            </div>
        );
    }
}

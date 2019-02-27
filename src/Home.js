import React, { Component } from 'react';
import { generateAuth} from "./awsConfig";
import User from "./User"


export default class Home extends Component {
    signOut() {
        // const auth = generateAuth();
        // await auth.signOut();
        this.props.cognitoUser.signOut();
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

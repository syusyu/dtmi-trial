import React, { Component } from 'react';
import { generateAuth} from "./awsConfig";
import User from "./User"

const signOut = async () => {
    const auth = generateAuth();
    await auth.signOut();
}

export default class Home extends Component {
    constructor(props) {
        super(props)
        console.log(`HOME.user=${JSON.stringify(props.user)}`)
    }
    render() {
        return (
            <div>
                <p>This is Home</p>
                <button onClick={signOut}>
                    Sign out
                </button>
                <User {...this.props}/>
            </div>
        );
    }
}

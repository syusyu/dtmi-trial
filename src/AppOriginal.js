import React, { Component } from 'react';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

Amplify.configure({
    Auth: {
        identityPoolId: 'us-east-2:7635a46e-4cec-4e97-96fc-40824a1ab117',
        region: 'us-east-2',
        userPoolId: 'us-east-2_DPov4QPw4',
        userPoolWebClientId: '7f65ue6qulachuapnj4r3qe8vq'
    }
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default withAuthenticator(App);


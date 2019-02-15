import React from 'react'
import { Redirect } from 'react-router-dom'

const AuthRCognitoRequired = (props) => {
    return props.authenticated ? props.children : <Redirect to={'/login'}/>
}

export default AuthRCognitoRequired
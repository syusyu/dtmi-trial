import React from 'react'
import { Redirect } from 'react-router-dom'

const AuthCognitoRequired = (props) => {
    return props.authenticated ? props.children : <Redirect to={'/login'}/>
}

export default AuthCognitoRequired
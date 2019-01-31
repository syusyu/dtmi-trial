import React from 'react'
import { Redirect } from 'react-router-dom'

const AuthRCognitoRequired = (props) => {
    console.log(`auth=${props.authenticated}, token=${props.hasNotifyToken}`)
    return props.authenticated ? props.children : <Redirect to={'/login'}/>
}

export default AuthRCognitoRequired
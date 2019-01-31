import React from 'react'
import { Redirect } from 'react-router-dom'

const AuthLineRequired = (props) => {
    // console.log(`auth=${props.authenticated}, token=${props.hasNotifyToken}`)
    return !props.authenticated ? <Redirect to={'/login'}/> :
        !props.hasNotifyToken() ? <Redirect to={'/line-notify-auth'} /> : props.children
}

export default AuthLineRequired
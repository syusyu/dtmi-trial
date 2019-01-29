import React from 'react'
import { Redirect } from 'react-router-dom'

const AuthRequired = (props) => (props.authenticated ? props.children : <Redirect to={'/login'}/>)

export default AuthRequired
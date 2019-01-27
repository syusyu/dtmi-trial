import React, { Component } from 'react';
import LoginBtn from 'Images/btn-line-login.png';
import { Link } from "react-router-dom";

const url = `https://${CONFIG.COGNITO_APP_WEB_DOMAIN}/login?response_type=code&client_id=${CONFIG.COGNITO_CLIENT_ID}
&redirect_uri=https://localhost:3001/idpresponse`;

class Login extends Component {
    render() {
        return (
            <div>
                <p>
                    LINEにログインして、LINE Notifyの友達追加をしてください。<br />
                    本アプリケーションは、お客様のメールアドレスを取得しますが、その取り扱いにあたり、必要な法令、ガイドラインを遵守しています。<br />
                </p>
                <a href={url}>
                    <img src={LoginBtn} width="10%" />
                </a>
            </div>
        );
    }
}

export default Login;

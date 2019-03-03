import {CognitoAuth} from "amazon-cognito-auth-js/dist/amazon-cognito-auth";
const AWS = require('aws-sdk');

export const generateAuth = (onSuccess, onFailure) => {
    const cognitoConfig = {
        ClientId: CONFIG.COGNITO_CLIENT_ID,
        AppWebDomain: CONFIG.COGNITO_APP_WEB_DOMAIN,
        TokenScopesArray: [
            "openid",
            "aws.cognito.signin.user.admin"
        ],
        RedirectUriSignIn: CONFIG.COGNITO_REDIRECT_URI_SIGNIN,
        RedirectUriSignOut: CONFIG.COGNITO_REDIRECT_URI_SIGNOUT,
        IdentityProvider: 'LINE',
        UserPoolId: CONFIG.COGNITO_USER_POOL_ID
    };

    const auth = new CognitoAuth(cognitoConfig);

    auth.userhandler = {
        onSuccess: function(result) {
            const loginKey = `cognito-idp.${CONFIG.COGNITO_REGION}.amazonaws.com/${CONFIG.COGNITO_USER_POOL_ID}`
            console.log(`auth.userhandler.loginKey=${loginKey}`)
            const loginProvider = {};
            loginProvider[loginKey] = result.getIdToken().getJwtToken();

            AWS.config.region = CONFIG.COGNITO_REGION
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: CONFIG.COGNITO_IDENTITY_POOL_ID,
                Logins: loginProvider
            });
            AWS.config.credentials.refresh((error) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Successfully logged!');
                }
            });
            onSuccess ? onSuccess(result) : null;
            console.log(result);
        },
        onFailure: function(err) {
            console.log(err);
            onFailure ? onFailure(err) : null;
        }
    };
    auth.useCodeGrantFlow();
    return auth;
};

export const establishAuthSession = (cognitoUser) => {
    cognitoUser.getSession(function(err, session) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        console.log('session validity: ' + session.isValid());
    });
}

export const awsAppSync =  {
    "aws_appsync_graphqlEndpoint": "https://gezr5gm6lrf5lgczk2q3v34epu.appsync-api.ap-northeast-1.amazonaws.com/graphql",
    "aws_appsync_region": "ap-northeast-1",
    "aws_appsync_authenticationType": "AWS_IAM",
};

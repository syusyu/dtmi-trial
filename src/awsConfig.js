import {CognitoAuth} from "amazon-cognito-auth-js/dist/amazon-cognito-auth";


export const generateAuth = (onSuccess, onFailure) => {
    const cognitoConfig = {
        ClientId: CONFIG.COGNITO_CLIENT_ID,
        AppWebDomain: CONFIG.COGNITO_APP_WEB_DOMAIN,
        TokenScopesArray: [
            "profile",
            "openid",
            "aws.cognito.signin.user.admin"
        ],
        RedirectUriSignIn: CONFIG.COGNITO_REDIRECT_URI_SIGNIN,
        RedirectUriSignOut: CONFIG.COGNITO_REDIRECT_URI_SIGNOUT,
        IdentityProvider: 'LINE'
    };

    const auth = new CognitoAuth(cognitoConfig);
    auth.userhandler = {
        onSuccess: function(result) {
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

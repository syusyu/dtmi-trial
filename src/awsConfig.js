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

export const awsAppSync =  {
    "aws_appsync_graphqlEndpoint": "https://gezr5gm6lrf5lgczk2q3v34epu.appsync-api.ap-northeast-1.amazonaws.com/graphql",
    "aws_appsync_region": "ap-northeast-1",
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": "da2-4vgw5dnhmrfitjuzcdarp53l6m",
};


import {API, graphqlOperation} from "aws-amplify";

AWS.config.update({
    region: CONFIG.COGNITO_REGION,
    endpoint: "https://localhost:3001"
});

export class User {
    constructor(userId, notifyToken, searchWords = [], notifyTime = '09:00') {
        this.userId = userId
        this.notifyToken = notifyToken
        this.searchWords = searchWords
        this.notifyTime = notifyTime
    }

    setNotifyToken(notifyToken) {
        this.notifyToken = notifyToken
    }

    addSearchWords(searchWord) {
        this.searchWords.push(searchWord);
    }

    removeSearchWord(searchWord) {
        this.searchWords = this.searchWords.filter(e => e === searchWord)
    }

    setNotifyTime(notifyTime) {
        this.notifyTime = notifyTime;
    }
}

const createUserMutation = (userId) =>
    `mutation {
           createUser(UserId: "${userId}") {
             UserId
           }
        }`
export const createUser = async (userId) => {
    const result = await API.graphql(graphqlOperation(createUserMutation(userId)))
    const user = result.data.getUser
    return user != null ? new User(user.UserId) : null
}

const getUserQuery = (userId) =>
    `query {
           getUser(UserId: "${userId}") {
             UserId NotifyToken
           }
        }`

export const fetchUser = async (userId) => {
    const result = await API.graphql(graphqlOperation(getUserQuery(userId)))
    const user = result.data.getUser
    console.log(`fetchUser.user=${JSON.stringify(user)}`)
    return user != null ? new User(user.UserId, user.NotifyToken, user.SearchWords, user.NotifyTime) : null
}

const putUserMutation = (userId, notifyToken) =>
    `mutation {
           putUser(UserId: "${userId}", NotifyToken: "${notifyToken}") {
             UserId NotifyToken
           }
        }`

export const updateUserNotifyToken = async (user, notifyToken) => {
    console.log(`updateUserNotifyToken.user=${JSON.stringify(user)}, token=${notifyToken}`)
    const result = await API.graphql(graphqlOperation(putUserMutation(user.userId, notifyToken)))
    console.log(`updateUserNotifyToken. result=${JSON.stringify(result)}`)
    if (result.data.putUser == null) {
        throw Error(`Failed to update notifyToken`)
    }
    user.setNotifyToken(notifyToken)
    return user
}

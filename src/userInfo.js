import {API, graphqlOperation} from "aws-amplify";

export class User {
    constructor(userId, notifyToken, notifyTime = '09:00', searchWords = []) {
        this.userId = userId
        this.notifyToken = notifyToken
        this.notifyTime = notifyTime
        this.searchWords = searchWords
    }
}

const STORAGE_KEY_USER = 'SKU'

const updateUserToStorage = (user) => {
    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
}
const getUserFromStorage = () => JSON.parse(sessionStorage.getItem(STORAGE_KEY_USER))


const createUserMutation = (userId) =>
    `mutation {
           createUser(UserId: "${userId}") {
             UserId NotifyToken NotifyTime SearchWords
           }
        }`
export const createUserDB = async (userId) => {
    const apiResult = await API.graphql(graphqlOperation(createUserMutation(userId)))
    console.log(`userInfo.createUser. apiResult=${JSON.stringify(apiResult)}`)
    const user = apiResult.data.getUser ? new User(user.UserId) : null
    updateUserToStorage(user)
    return user
}

const getUserQuery = (userId) =>
    `query {
           getUser(UserId: "${userId}") {
             UserId NotifyToken NotifyTime SearchWords
           }
        }`

export const fetchUserDB = async (userId) => {
    const cache = getUserFromStorage()
    if (cache) {
        return cache
    }

    const apiResult = await API.graphql(graphqlOperation(getUserQuery(userId)))
    console.log(`userInfo.fetchUser.apiResult=${JSON.stringify(apiResult)}`)
    const dbUser = apiResult.data.getUser
    const user = dbUser != null ? new User(dbUser.UserId, dbUser.NotifyToken, dbUser.NotifyTime, dbUser.SearchWords) : null
    updateUserToStorage(user)
    return user
}

const putUserNotifyTokenMutation = (userId, notifyToken) =>
    `mutation {
           putUser(UserId: "${userId}", NotifyToken: "${notifyToken}") {
             UserId NotifyToken NotifyTime SearchWords
           }
        }`

export const updateUserNotifyTokenDB = async (user, notifyToken) => {
    const apiResult = await API.graphql(graphqlOperation(putUserNotifyTokenMutation(user.userId, notifyToken)))
    console.log(`userInfo.updateUserNotifyToken.apiResult=${JSON.stringify(apiResult)}`)
    if (apiResult.data.putUser == null) {
        throw Error(`Failed to update notifyToken`)
    }
    console.log(`updateUserNotifyTokenDB.user=${JSON.stringify(user)}`)
    user.notifyToken = notifyToken
    updateUserToStorage(user)
    return user
}

const putUserSearchWordsMutation = (userId, searchWords) =>
    `mutation {
           putUser(UserId: "${userId}", SearchWords: "${searchWords}") {
             UserId NotifyToken NotifyTime SearchWords
           }
        }`

export const updateUserSearchWordsDB = async (user, searchWords) => {
    const apiResult = await API.graphql(graphqlOperation(putUserSearchWordsMutation(user.userId, searchWords)))
    console.log(`userInfo.putUserSearchWordsMutation.apiResult=${JSON.stringify(apiResult)}`)
    if (apiResult.data.putUser == null) {
        throw Error(`Failed to update notifyToken`)
    }
    user.searchWords = searchWords
    updateUserToStorage(user)
    return user
}

import {API, graphqlOperation} from "aws-amplify";

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

const STORAGE_KEY_USER = 'SKU'

const updateUserToStorage = (user) => {
    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
}
const getUserFromStorage = () => JSON.parse(sessionStorage.getItem(STORAGE_KEY_USER))


const createUserMutation = (userId) =>
    `mutation {
           createUser(UserId: "${userId}") {
             UserId
           }
        }`
export const createUser = async (userId) => {
    const apiResult = await API.graphql(graphqlOperation(createUserMutation(userId)))
    console.log(`userInfo.createUser. apiResult=${JSON.stringify(apiResult)}`)
    const user = apiResult.data.getUser ? new User(user.UserId) : null
    updateUserToStorage(user)
    return user
}

const getUserQuery = (userId) =>
    `query {
           getUser(UserId: "${userId}") {
             UserId NotifyToken
           }
        }`

export const fetchUser = async (userId) => {
    const cache = getUserFromStorage()
    if (cache) {
        return cache
    }

    const apiResult = await API.graphql(graphqlOperation(getUserQuery(userId)))
    console.log(`userInfo.fetchUser.apiResult=${JSON.stringify(apiResult)}`)
    const dbUser = apiResult.data.getUser
    const user = dbUser != null ? new User(dbUser.UserId, dbUser.NotifyToken, dbUser.SearchWords, dbUser.NotifyTime) : null
    updateUserToStorage(user)
    return user
}

const putUserMutation = (userId, notifyToken) =>
    `mutation {
           putUser(UserId: "${userId}", NotifyToken: "${notifyToken}") {
             UserId NotifyToken
           }
        }`

export const updateUserNotifyToken = async (user, notifyToken) => {
    const apiResult = await API.graphql(graphqlOperation(putUserMutation(user.userId, notifyToken)))
    console.log(`userInfo.updateUserNotifyToken. apiResult=${JSON.stringify(apiResult)}`)
    if (apiResult.data.putUser == null) {
        throw Error(`Failed to update notifyToken`)
    }
    user.setNotifyToken(notifyToken)
    updateUserToStorage(user)
    return user
}

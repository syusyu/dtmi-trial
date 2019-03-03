import {API, graphqlOperation} from "aws-amplify";

export class User {
    constructor(userId, notifyToken, notifyTime = '09:00', searchWords = [], programs = []) {
        this.userId = userId
        this.notifyToken = notifyToken
        this.notifyTime = notifyTime
        this.searchWords = searchWords
        this.programs = programs
    }
}

// const STORAGE_KEY_USER = 'SKU'
// const updateUserToStorage = (user) => {
//     sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
// }
// const getUserFromStorage = () => JSON.parse(sessionStorage.getItem(STORAGE_KEY_USER))
// export const deleteUserFromStorage = () => sessionStorage.removeItem(STORAGE_KEY_USER)

const createUserMutation = (userId) =>
    `mutation {
           createUser(UserId: "${userId}") {
             UserId NotifyToken NotifyTime SearchWords
             Programs{SearchWord Programs{Title Station ProgramId Notify Link Date}}
           }
        }`
export const createUserDB = async (userId) => {
    const apiResult = await API.graphql(graphqlOperation(createUserMutation(userId)))
    console.log(`userInfo.createUserDB.apiResult=${JSON.stringify(apiResult)}`)
    const dbUser = apiResult.data.createUser
    const user = dbUser ? new User(dbUser.UserId) : null
    return user
}

const getUserQuery = (userId) =>
    `query {
           getUser(UserId: "${userId}") {
             UserId NotifyToken NotifyTime SearchWords
             Programs{SearchWord Programs{Title Station ProgramId Notify Link Date}}
           }
        }`

export const fetchUserDB = async (userId) => {
    const apiResult = await API.graphql(graphqlOperation(getUserQuery(userId)))
    console.log(`userInfo.fetchUser.apiResult=${JSON.stringify(apiResult)}`)
    const dbUser = apiResult.data.getUser
    const user = dbUser != null ? new User(dbUser.UserId, dbUser.NotifyToken, dbUser.NotifyTime, dbUser.SearchWords, dbUser.Programs) : null
    return user
}

const updateUserNotifyTokenMutation = (userId, notifyToken) =>
    `mutation {
           updateUserNotify(UserId: "${userId}", NotifyToken: "${notifyToken}") {
             UserId NotifyToken NotifyTime SearchWords
             Programs{SearchWord Programs{Title Station ProgramId Notify Link Date}}
           }
        }`

export const updateUserNotifyTokenDB = async (user, notifyToken) => {
    const apiResult = await API.graphql(graphqlOperation(updateUserNotifyTokenMutation(user.userId, notifyToken)))
    console.log(`userInfo.updateUserNotifyToken.apiResult=${JSON.stringify(apiResult)}`)
    if (apiResult.data.updateUserNotify == null) {
        throw Error(`Failed to update notifyToken`)
    }
    user.notifyToken = notifyToken
    return user
}

const updateUserSearchWordsMutation = (userId, searchWords) =>
    `mutation {
           updateUserSearchWords(UserId: "${userId}", SearchWords: ${JSON.stringify(searchWords)}) {
             UserId NotifyToken NotifyTime SearchWords
             Programs{SearchWord Programs{Title Station ProgramId Notify Link Date}}
           }
        }`

export const updateUserSearchWordsDB = async (user, searchWords) => {
    const apiResult = await API.graphql(graphqlOperation(updateUserSearchWordsMutation(user.userId, searchWords)))
    console.log(`userInfo.updateUserSearchWordsDB.apiResult=${JSON.stringify(apiResult)}`)
    if (apiResult.data.updateUserSearchWords == null) {
        throw Error(`Failed to update notifyToken`)
    }
    user.searchWords = searchWords
    return user
}

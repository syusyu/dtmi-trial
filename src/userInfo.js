export class User {
    // constructor(userId, notifyToken, searchWords, notifyTime) {
    constructor(userId) {
        this.userId = userId
        this.notifyToken = null
        this.searchWords = []
        this.notifyTime = '09:00'
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

export const createUser = (userId) => {
    return new User(userId);
}

export const fetchUser = (userId) => {
    return null;
    // const user = new User(userId);
    // //TODO fetch user from DB
    // return user;
}

export const persistUser = (user) => {
    //TODO persist user to DB
}
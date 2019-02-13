import {dbRequest} from "./dbutil"
const aws = require('aws-sdk');
AWS.config.update({
    region: CONFIG.COGNITO_REGION,
    endpoint: "https://localhost:3001"
});

export class User {
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

export const createUser = async (user) => {
    return new User(user.userId)
    // const db = new aws.DynamoDB.DocumentClient();
    // return await dbRequest(db.put({
    //     TableName: 'User',
    //     Item: user
    // }))
}

export const fetchUser = async (userId) => {
    let user = new User(userId)
    user.setNotifyToken('xxxxx')
    return user;

    // const db = new aws.DynamoDB.DocumentClient();
    // return await dbRequest(db.get({
    //     TableName: 'User',
    //     Key: {
    //         userId: userId
    //     }
    // }))
}

export const updateUser = async (user) => {
    // const db = new aws.DynamoDB.DocumentClient();
    // return await dbRequest(db.update({
    //     TableName: 'User',
    //     Key: {
    //         userId: user.userId
    //     },
    //     UpdateExpression: "set notifyToken = :n",
    //     ExpressionAttributeValues:{
    //         ":n":user.notifyToken
    //     },
    //     ReturnValues:"UPDATED_NEW"
    // }))
}

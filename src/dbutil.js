export const dbRequest = async (req) => {
    const p = new Promise((resolve, reject) => {
        req.on('success', (response) => {
            console.log(`dbRequest is success. req=${JSON.stringify(response)}`)
            resolve(response)
        })
        req.on('error', (error) => {
            console.log(`dbRequest is error. req=${JSON.stringify(error)}`)
            reject(error)
        })
    });
    req.send()
    return p
}
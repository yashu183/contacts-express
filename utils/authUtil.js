const jwt = require('jsonwebtoken');
const env = require('../utils/env.json');

class AuthUtil {
    static signAuthToken(payload) {
        console.log('Enter Auth Utils - signAuthToken: ', payload);
        const token = jwt.sign(payload, env.jwt_secret);
        console.log('Exit Auth Utils - signAuthToken: ', token);
        return token;
    }

    static async verifyAuthToken(token) {
        console.log('Enter Auth Utils - verifyAuthToken: ', token);
        // try {
        //     if (!token) {
        //         throw 'Access denied. No token found';
        //     }
        //     // get the payload by decoding the token
        //     const payload = jwt.verify(token);
        //     console.log('Exit Auth Utils - verifyAuthToken: ', payload);
        //     return payload;
        // } catch (error) {
        //     console.log('Error in Auth Utils - verifyAuthToken: ', error);
        //     return error;
        // }
        return new Promise((resolve, reject) => {
            if (!token) {
                reject('Access denied. No token found');
            }
            // get the payload by decoding the token
            const payload = jwt.verify(token, env.jwt_secret);
            console.log('Exit Auth Utils - verifyAuthToken: ', payload);
            resolve(payload);
        });
    }
}

module.exports = AuthUtil;

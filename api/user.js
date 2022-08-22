const DbUtil = require('../utils/dbUtil');
const AuthUtil = require('../utils/authUtil');
const User = require('../models/User');

class UserApi {
    static async addUser(event, callback) {
        console.log('Enter User API - add user - event body: ', event.body, typeof event.body);
        try {
            await DbUtil.dbConnect();
            const { userName, email, password, date } = event.body;
            var user = await User.findOne({ email });
            if (user) {
                throw 'User already exists';
            }
            user = new User({
                userName,
                email,
                password,
                date
            });
            await user.save();
            const payload = {
                user_id: user._id
            };
            const token = AuthUtil.signAuthToken(payload);
            console.log('Exit User API - add user: ', token);
            callback(null, {
                msg: 'user registered successfully',
                token: token
            });
        } catch (error) {
            console.log('Error in User API - add user: ', error);
            callback({
                error: error
            });
        }
    }

    static async getLoggedInuser(event, callback) {
        console.log('Enter User API - getLoggedInUser: ', event.body);
        try {
            const token = event.headers.authorization
                ? event.headers.authorization
                : event.headers.Authorization;
            const decodedPayload = await AuthUtil.verifyAuthToken(token);
            console.log(decodedPayload);
            await DbUtil.dbConnect();
            const user = await User.findById(decodedPayload.user_id);
            if (!user) {
                throw {
                    error: 'User not found. Please login',
                    statusCode: 500
                };
            }
            console.log('Exit User API - getLoggedInUser: ', user);
            callback(null, user);
        } catch (error) {
            console.log('Error in User API - getLoggedInUser: ', error);
            callback({
                error,
                statusCode: 401
            });
        }
    }
}

module.exports = UserApi;

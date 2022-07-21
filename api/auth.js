const DbUtil = require('../utils/dbUtil');
const AuthUtil = require('../utils/authUtil');
const User = require('../models/User');

class Auth {
    static async login(event, callback) {
        console.log('Enter Auth API - login: ', event.body);
        try {
            await DbUtil.dbConnect();
            const { email, password } = event.body;
            const user = await User.findOne({ email });
            console.log('user: ', user);
            if (!user) {
                throw 'Account not found. Please signup';
            }
            if (password == user.password) {
                const payload = {
                    user_id: user._id
                };
                const token = AuthUtil.signAuthToken(payload);
                console.log('Exit Auth API - login: ', token);
                callback(null, {
                    msg: 'user logged in successfully',
                    token: token
                });
            } else {
                throw 'Wrong password';
            }
        } catch (error) {
            console.log('Error in Auth API: ', error);
            callback({
                error: error
            });
        }
        console.log('Exit Auth API - login: ');
    }
}

module.exports = Auth;

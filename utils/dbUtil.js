const mongoose = require('mongoose');

const env = require('./env.json');

class DbUtil {
    static async dbConnect() {
        try {
            console.log('Enter DbUtil - dbConnect');
            await mongoose.connect(env.mongoDbUrl);
            console.log('Mongo DB connected....');
            console.log('Exit DbUtil - dbConnect');
        } catch (err) {
            console.log('Error DbUtil - dbConnect', err);
            process.exit(1);
        }
    }
}

module.exports = DbUtil;

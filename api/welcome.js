const Guid = require('guid');

class Welcome{
    static async getWelcomeMessage(event, callback) {
        console.log('Enter Welcome - Welcome message - event body', event.body, typeof event.body);

        try {
            var guid = Guid.create();
            var welcomeMessage = `Hello!! Welcome to Yashu's server - testing CI/CD with this get request V6.0. This GUID is added to test new dependencies installation through CI/CD ${guid}`
            console.log('Exit Welcome - Welcome message: ', welcomeMessage);
            callback(null, {
                welcomeMessage
            });
        } catch (error) {
            console.error('Error in Welcome API - getWelcomeMessage: ', error);
            callback({
                error
            });
        }
    }
}

module.exports.getWelcomeMessage = Welcome.getWelcomeMessage;

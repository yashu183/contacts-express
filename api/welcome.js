class Welcome{
    static async getWelcomeMessage(event, callback) {
        console.log('Enter Welcome - Welcome message - event body', event.body, typeof event.body);
        try {
            var welcomeMessage = "Hello!! Welcome to Yashu's server - testing CI/CD with this get request V5.0"
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

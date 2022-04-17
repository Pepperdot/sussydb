const fs = require('fs');

class AuthHandler {
    constructor() {

    }

    async handleAuth(json) {
        let users = JSON.parse(await fs.readFileSync('privatedb/users/users.json').toString());
        let user = users.find(user => user.name === json.auth.name);
        if(user) {
            if(user.password === json.auth.password) {
                delete user.pwd;
                return {
                    success: true,
                    user: user
                };
            }
        } else {
            return {
                success: false,
                user: null
            };
        }
    }
}

module.exports = AuthHandler;
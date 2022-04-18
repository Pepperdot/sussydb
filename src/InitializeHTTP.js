const SussySettings = require('./Settings').getInstance();

function InitializeHTTP(app) {
    console.log("InitializeHTTP");
    app.get('/', function (req, res) {
        res.send('SussyDB, ' + SussySettings.getSetting('version'));
    });
}

module.exports = InitializeHTTP;
function InitializeWS() {
    console.log("InitializeWS");
    const WebSocket = require('ws');
    const authReq = require('./AuthHandler');
    const authHandler = new authReq();
    const SussySettings = require('./Settings').getInstance();
    while(SussySettings.isReady() === false) {
        console.log('Waiting for settings to be ready...');
        setTimeout(() => {}, 1000);
    }
    const wss = new WebSocket.Server({ port: SussySettings.getSetting('port') });
    console.log('SussyDB is running on port ' + SussySettings.getSetting('port'));

    wss.on('connection', function connection(ws) {
        let auth = false;
        console.log('New connection');
        ws.on('message', async function incoming(message) {
            const json = JSON.parse(message);
            if(json === undefined) {
                console.log('Received undefined message');
                ws.close();
            }
            switch (json.type) {
                case "auth":
                    await authHandler.handleAuth(json);
                    break;
            }
        });
        ws.send('something');
    });
}

module.exports = InitializeWS;
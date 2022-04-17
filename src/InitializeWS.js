function InitializeWS() {
    console.log("InitializeWS");
    const WebSocket = require('ws');
    const authReq = require('./AuthHandler');
    const authHandler = new authReq();
    const Databases = require('./Databases').getInstance();
    const Permissions = require('./Permissions').getInstance();
    const SussySettings = require('./Settings').getInstance();
    while(SussySettings.isReady() === false) {
        console.log('Waiting for settings to be ready...');
        setTimeout(() => {}, 1000);
    }
    const wss = new WebSocket.Server({ port: SussySettings.getSetting('port') });
    console.log('SussyDB is running on port ' + SussySettings.getSetting('port'));

    wss.on('connection', function connection(ws) {
        let wsAuthed = false;
        let wsUser;
        console.log('New connection');
        ws.on('message', async function incoming(message) {
            const json = JSON.parse(message);
            if(json === undefined) {
                console.log('Received undefined message');
                ws.close();
            }
            switch (json.type) {
                case "auth":
                    const auth = await authHandler.handleAuth(json);
                    if(auth.success === true) {
                        wsAuthed = true;
                        wsUser = auth.user;
                        ws.send(JSON.stringify({
                            type: "auth",
                            success: true,
                            permissions: auth.permissions
                        }));
                    } else {
                        ws.send(JSON.stringify({
                            type: "auth",
                            success: false
                        }));
                        ws.close();
                    }
                    break;
                case "db":
                    if(wsAuthed === true) {
                        const checkIfExists = await Databases.dbExists(json.name);
                        if(checkIfExists === true) {
                            const userHasPerm = await Permissions.userHasPermission(wsUser.permissions, json.name);
                            if(userHasPerm.length > 0) {
                                ws.send(JSON.stringify({
                                    type: "db",
                                    permissions: userHasPerm,
                                    success: true
                                }));
                            } else {
                                ws.send(JSON.stringify({
                                    type: "db",
                                    name: json.name,
                                    success: false
                                }));
                            }
                        } else {
                            ws.send(JSON.stringify({
                                type: "db",
                                name: json.name,
                                success: false
                            }));
                        }
                    }
                    break;
            }
        });
        setTimeout(() => {
            if(!wsAuthed) {
                ws.close();
            }
        }, 15000);
    });
}

module.exports = InitializeWS;
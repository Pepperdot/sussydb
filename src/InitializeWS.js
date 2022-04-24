let active = false;

function SocketIsActive() {
    if(active) {
        return true;
    }
    setTimeout(() => {
        if(active) {
            return true;
        }
        return false;
    }, 2500);
}

function InitializeWS() {
    console.log("InitializeWS");
    const WebSocket = require('ws');
    const authReq = require('./AuthHandler');
    const authHandler = new authReq();
    const Databases = require('./Databases').getInstance();
    const Permissions = require('./Permissions').getInstance();
    const SussySettings = require('./Settings').getInstance();
    const CrudService = require('./CrudService').getInstance();
    const InitializeHTTP = require('./InitializeHTTP');
    const express = require('express');
    const app = express();
    const server = require('http').createServer(app);
    InitializeHTTP(app);
    while(SussySettings.isReady() === false) {
        console.log('Waiting for settings to be ready...');
        setTimeout(() => {}, 1000);
    }
    const wss = new WebSocket.Server({ server });
    app.on('upgrade', (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    });
    console.log('SussyDB is running on port ' + SussySettings.getSetting('port'));
    active = true;

    wss.on('connection', function connection(ws) {
        let wsAuthed = false;
        let wsUser;
        console.log('New connection');
        ws.on('message', async function incoming(message) {
            let json;
            try {
                json = JSON.parse(message);
            } catch (e) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Invalid JSON'
                }));
                return;
            }
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
                            const collections = await Databases.getCollections(json.name);
                            if(userHasPerm.length > 0) {
                                ws.send(JSON.stringify({
                                    type: "db",
                                    permissions: userHasPerm,
                                    db: json.name,
                                    collections: collections,
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
                case "crud":
                    if(wsAuthed === true) {
                        const checkIfExists = await Databases.dbExists(json.crud.db);
                        const checkIfCollectionExists = await Databases.collectionExists(json.crud.db, json.crud.collection);
                        if(checkIfExists === true) {
                            const userHasPerm = await Permissions.userHasPermission(wsUser.permissions, json.crud.db);
                            if(userHasPerm.length > 0) {
                                const crud = await CrudService.handleCrud(json.crud);
                                let success = false;
                                if(crud === null) {
                                    success = false;
                                } else {
                                    success = true;
                                }
                                ws.send(JSON.stringify({
                                    type: "crud",
                                    crud: crud,
                                    success: success
                                }));
                            } else {
                                ws.send(JSON.stringify({
                                    type: "crud",
                                    name: json.name,
                                    success: false
                                }));
                            }
                        } else {
                            ws.send(JSON.stringify({
                                type: "crud",
                                name: json.name,
                                success: false
                            }));
                        }
                    }
                    break;
                case "info":
                    let toGive = {};
                    let version = SussySettings.getSetting('version');
                    toGive.name = "SussyDB";
                    toGive.version = version;
                    ws.send(JSON.stringify({
                        type: "info",
                        info: toGive,
                        success: true
                    }));
                    break;
                case "dbs":
                    if(wsAuthed === true) {
                        const dbsBeforePerm = await Databases.getDBs();
                        let dbs = [];
                        for(let i = 0; i < dbsBeforePerm.length; i++) {
                            const db = dbsBeforePerm[i].name;
                            const userHasPerm = await Permissions.userHasPermission(wsUser.permissions, db);
                            if(userHasPerm.length > 0) {
                                dbs.push(db);
                            }
                        }
                        ws.send(JSON.stringify({
                            type: "dbs",
                            dbs: dbs,
                            success: true
                        }));
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
    server.listen(SussySettings.getSetting('port'), () => {
        console.log(`HTTP Server started on port ${SussySettings.getSetting('port')}`);
    });
}

module.exports = {
    InitializeWS,
    SocketIsActive
};
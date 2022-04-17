const fs = require("fs");
const path = require("path");
const dbFolder = path.join('db/');
const Databases = require('./Databases');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const InitializeWS = require('./InitializeWS');
let databases = Databases.getInstance();

function InitializeDB() {
    console.log("InitializeDB");
    if(fs.existsSync(dbFolder)) {
        console.log("Loading database...");
        fs.readdirSync(dbFolder).forEach(file => {
            if(fs.lstatSync(path.join(dbFolder, file)).isDirectory()) {
                databases.push(file);
            }
        });
        console.log("Loaded " + databases.get().length + " databases.");
        InitializeWS();
    } else {
        console.log("Welcome to SussyDB. Please wait while we create the database folder...");
        fs.mkdirSync(dbFolder);
        console.log("Database folder created.");
        console.log("Creating databases...");
        fs.mkdirSync(path.join(dbFolder, 'admin'));
        fs.mkdirSync(path.join(dbFolder, 'test'));
        fs.mkdirSync(path.join('privatedb/'));
        fs.mkdirSync(path.join('privatedb/users'));
        console.log("Creating collections...");
        fs.writeFileSync(path.join(dbFolder, 'admin', 'admin.json'), JSON.stringify([]));
        fs.writeFileSync(path.join(dbFolder, 'test', 'test.json'), JSON.stringify([]));
        fs.writeFileSync(path.join('privatedb/', 'users', 'users.json'), JSON.stringify([]));
        fs.writeFileSync('sussysettings.json', JSON.stringify([{name: "port", value: 6942}]));
        console.log("Databases and collections created.\n\n");
        console.log("Now you will be asked to create a user.\n");
        readline.question("Input a username for the user: ", name => {
            readline.question(`Input a password for user ${name}: `, pwd => {
                let user = {
                    name: name,
                    pwd: pwd,
                    permissions: [
                        'readWriteAnyDB'
                    ]
                };
                fs.writeFileSync(path.join('privatedb/', 'users', 'users.json'), JSON.stringify([user]));
                console.log("User created.\n\n");
                console.log("Now you can use SussyDB.\n");
                InitializeDB();
            });
        });
    }
}

module.exports = InitializeDB;
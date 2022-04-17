class Permissions {
    async userHasPermission(permissions, db) {
        let dbName = db.charAt(0).toUpperCase() + db.slice(1);
        let validPerms = [];
        permissions.map(perm => {
            if(perm === `read${dbName}DB`){
                validPerms.push(perm);
            }
            if(perm === `write${dbName}DB`){
                validPerms.push(perm);
            }
            if(perm === `readWrite${dbName}DB`){
                validPerms.push(perm);
            }
            if(perm === `readAnyDB`){
                validPerms.push(perm);
            }
            if(perm === `writeAnyDB`){
                validPerms.push(perm);
            }
            if(perm === `readWriteAnyDB`){
                validPerms.push(perm);
            }
        });
        return validPerms;
    }
}

class PermissionsSingleton {
    constructor() {
        throw new Error('Use Singleton.getInstance()');
    }

    static getInstance() {
        if (!PermissionsSingleton.instance) {
            PermissionsSingleton.instance = new Permissions();
        }
        return PermissionsSingleton.instance;
    }
}
module.exports = PermissionsSingleton;
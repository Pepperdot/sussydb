const fs = require('fs');
const path = require('path');
const CrudError = require('./errors/CrudError');

class CrudService {
    constructor() {
    }

    async handleCrud(crud) {
        if(crud.action === "findall") {
            return await this.findAll(crud.db, crud.collection);
        }
        if(crud.action === "find") {
            return await this.find(crud.db, crud.collection, crud.query);
        }
        if(crud.action === "insert") {
            return await this.insert(crud.db, crud.collection, crud.data);
        }
        if(crud.action === "update") {
            return await this.update(crud.db, crud.collection, crud.query, crud.data);
        }
        if(crud.action === "delete") {
            return await this.delete(crud.db, crud.collection, crud.query);
        }
    }

    async findAll(db, collectionName) {
        return fs.readFileSync(path.join(__dirname, `../db/${db}/${collectionName}.json`), 'utf8');
    }

    async find(db, collectionName, query) {
        let collection = JSON.parse(fs.readFileSync(path.join(__dirname, `../db/${db}/${collectionName}.json`), 'utf8'));
        let result = collection.filter(item => {
            let match = true;
            for(let key in query) {
                if(item[key] !== query[key]) {
                    match = false;
                }
            }
            return match;
        });
        if(result.length === 0) {
            return null;
        }
        return JSON.stringify(result);
    }

    async insert(db, collectionName, data) {
        let collection = JSON.parse(fs.readFileSync(path.join(__dirname, `../db/${db}/${collectionName}.json`), 'utf8'));
        collection.push(data);
        fs.writeFileSync(path.join(__dirname, `../db/${db}/${collectionName}.json`), JSON.stringify(collection));
        return JSON.stringify(collection);
    }

    async update(db, collectionName, query, data) {
        let collection = JSON.parse(fs.readFileSync(path.join(__dirname, `../db/${db}/${collectionName}.json`), 'utf8'));
        let result = collection.filter(item => {
            let match = true;
            for(let key in query) {
                if(item[key] !== query[key]) {
                    match = false;
                }
            }
            return match;
        });
        if(result.length === 0) {
            return null;
        }
        if(result.length > 1) {
            return null;
        }
        for(var i = 0; i < collection.length; i++){
            if (collection[i] === result[0]) {
                collection.splice(i, 1);
            }
        }
        collection.push(data);
        fs.writeFileSync(path.join(__dirname, `../db/${db}/${collectionName}.json`), JSON.stringify(collection));
        return JSON.stringify(collection);
    }

    async delete(db, collectionName, query) {
        let collection = JSON.parse(fs.readFileSync(path.join(__dirname, `../db/${db}/${collectionName}.json`), 'utf8'));
        let result = collection.filter(item => {
            let match = true;
            for(let key in query) {
                if(item[key] !== query[key]) {
                    match = false;
                }
            }
            return match;
        });
        if(result.length === 0) {
            return null;
        }
        if(result.length > 1) {
            return null;
        }
        for(var i = 0; i < collection.length; i++){
            if (collection[i] === result[0]) {
                collection.splice(i, 1);
            }
        }
        fs.writeFileSync(path.join(__dirname, `../db/${db}/${collectionName}.json`), JSON.stringify(collection));
        return JSON.stringify(collection);
    }
}

class CrudSingleton {
    constructor() {
        throw new Error('Use Singleton.getInstance()');
    }

    static getInstance() {
        if (!CrudSingleton.instance) {
            CrudSingleton.instance = new CrudService();
        }
        return CrudSingleton.instance;
    }
}

module.exports = CrudSingleton;
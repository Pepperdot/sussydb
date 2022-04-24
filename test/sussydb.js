const assert = require('assert');
const IntializeDB = require('../src/InitializeDB');
const {SocketIsActive} = require('../src/InitializeWS');
const Settings = require('../src/Settings').getInstance();

describe('Database', function () {
    describe('Socket', function () {
        it('SocketIsActive', function () {
            IntializeDB();
            assert.equal(SocketIsActive(), true);
        });
    });
    describe('CRUD', function () {
        const CrudService = require('../src/CrudService').getInstance();
        it('Inserting', function () {
            let insert = CrudService.handleCrud({
                "action": "insert",
                "db": "test",
                "collection": "test",
                "data": {
                    "actions": "hi"
                }
            });
            assert.notEqual(insert, null);
        });
        it('Reading', function () {
            let read = CrudService.handleCrud({
                "action": "read",
                "db": "test",
                "collection": "test",
                "data": {
                    "actions": "hi"
                }
            });
            assert.notEqual(read, null);
        });
        it('Updating', function () {
            let update = CrudService.handleCrud({
                "action": "update",
                "db": "test",
                "collection": "test",
                "query": {
                    "actions": "hi"
                },
                "data": {
                    "actions": "hi, again!"
                }
            });
            assert.notEqual(update, null);
        });
        it('Deleting', function () {
            let deleteCrud = CrudService.handleCrud({
                "action": "delete",
                "db": "test",
                "collection": "test",
                "query": {
                    "actions": "hi, again!"
                }
            });
            assert.notEqual(deleteCrud, null);
        });
    });
    describe('Settings', function () {
        it('Get Setting', function () {
            assert.equal(Settings.getSetting('name'), 'SussyDB');
        });
    });
});
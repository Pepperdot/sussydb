const fs = require('fs');
const path = require('path');

class Settings {
    constructor() {
        this.settings = [];
        this.ready = false;
        this.settingsFile = path.join('sussysettings.json');
        this.loadSettings();
    }

    push(setting) {
        this.settings.push(setting);
    }

    get() {
        return this.settings;
    }

    getSetting(setting) {
        return this.settings.find(s => s.name === setting).value;
    }

    isReady() {
        return this.ready;
    }

    loadSettings() {
        console.log('LoadSettings');
        if (fs.existsSync(this.settingsFile)) {
            this.settings = JSON.parse(fs.readFileSync(this.settingsFile));
            this.ready = true;
        }
    }
}

class SettingsSingleton {
    constructor() {
        throw new Error('Use Singleton.getInstance()');
    }

    static getInstance() {
        if (!SettingsSingleton.instance) {
            SettingsSingleton.instance = new Settings();
        }
        return SettingsSingleton.instance;
    }
}
module.exports = SettingsSingleton;
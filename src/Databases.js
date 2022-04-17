class Databases {
  constructor() {
    this.databases = [];
  }

  push(database) {
    this.databases.push(database);
  }

  get() {
    return this.databases;
  }

  getByName(name) {
    return this.databases.find(database => database === name);
  }

  dbExists(name) {
    return !!this.databases.find(database => database === name);
  }
}

class DatabasesSingleton {
  constructor() {
    throw new Error('Use Singleton.getInstance()');
  }

  static getInstance() {
    if (!DatabasesSingleton.instance) {
      DatabasesSingleton.instance = new Databases();
    }
    return DatabasesSingleton.instance;
  }
}
module.exports = DatabasesSingleton;
class Databases {
  constructor() {
    this.databases = [];
  }

  pushDBs(database) {
    this.databases.push(database);
  }

  getDBs() {
    return this.databases;
  }

  getCollections(name) {
    return this.databases.find(database => database.name === name).collections;
  }

  getByName(name) {
    return this.databases.find(database => database.name === name);
  }

  dbExists(name) {
    return !!this.databases.find(database => database.name === name);
  }

  collectionExists(name, collection) {
    return !!this.databases.find(database => database.name === name).collections.find(col => col === collection);
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
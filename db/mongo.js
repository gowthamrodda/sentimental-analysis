'use strict';
const MongoClient = require('mongodb');

const config = require('../config/dev');

class Mongo {

  constructor(dbName, url) {
    this.url = `${url}/${dbName}`;
    this.db = null;
  }

  async connect() {
    try {
      this.db = await MongoClient.connect(this.url, {useNewUrlParser: true});
    } catch (err) {
      throw err;
    }
  }

  disConnect() {
    if (this.db) {
      console.log('-------------> disconnecting');
      this.db.close();
    }
  }
}

module.exports = new Mongo(config.mongodb.db, config.mongodb.url);

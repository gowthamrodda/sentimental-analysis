const mongo = require('./mongo');
const config = require('config/dev');

class Queries {

  constructor(collection, options) {
    this.collection = config.db.collection || collection;
    this.options = config.db.options || options;
  }

  async find() {
    try {
      return mongo
        .db
        .collection(this.collection)
        .find()
        .toArray();
    } catch (e) {
      throw e;
    }
  }

  async insertOne(document) {
    try {
      return mongo
        .db
        .collection(this.collection)
        .insertOne(document);
    } catch (e) {
      throw e;
    }
  }
}
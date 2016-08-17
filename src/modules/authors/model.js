const BaseModel = require('../../classes/base_model');

const instanceProps = {
  tableName: 'authors',
  hasTimestamps: true,
  books: function () {
    return this.hasMany(require('../books/model'));
  },
  photos: function () {
    return this.morphMany(require('../photos/model'), 'imageable');
  }
};

const classProps = {
  typeName: 'authors',
  createWithRandomBook: function (params) {
    // this should be in a transaction
    return this.create(params).then(function (model) {
      return require('../books/model').create({
        title: Math.random().toString(36).slice(-8),
        date_published: new Date().toISOString().slice(0,10),
        author_id: model.get('id')
      }).return(model);
    });
  },
  filters: {
    id: function (qb, value) {
      return qb.whereIn('id', value);
    },
    name: function (qb, value) {
      return qb.whereIn('name', value)
    },
    alive: function (qb, value) {
      return qb.whereNull('date_of_death');
    },
    dead: function (qb, value) {
      return qb.whereNotNull('date_of_death');
    },
    date_of_birth: function (qb, value) {
      return qb.whereIn('date_of_birth', value);
    },
    date_of_death: function (qb, value) {
      return qb.whereIn('date_of_death', value);
    },
    born_before: function (qb, value) {
      return qb.where('date_of_birth', '<', value);
    },
    born_after: function (qb, value) {
      return qb.where('date_of_birth', '>', value);
    }
  },
  relations: [
    'books',
    'books.chapters',
    'photos'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);

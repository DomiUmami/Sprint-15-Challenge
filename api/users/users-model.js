const db = require('../../data/dbConfig.js');

function add(user) {
  return db('users')
    .insert(user)
    .returning('*')
    .then(([newUser]) => newUser);
}

function findBy(filter) {
  return db('users').where(filter);
}

function findById(id) {
  return db('users').where({ id }).first();
}

module.exports = {
  add,
  findBy,
  findById,
}
exports.up = function(knex) {
    return knex.schema.createTable('jokes', table => {
      table.increments('id');
      table.string('joke').notNullable();
      table.string('punchline').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('jokes');
  };
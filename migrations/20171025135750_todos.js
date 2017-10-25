
exports.up = function(knex, Promise) {
  return knex.schema.createTable('todos', function(table){
    table.increments();
    table.string('task').notNullable().defaultTo('');
    table.integer('user_id').references('id').inTable('users').index().onDelete('cascade');
    table.timestamps(true,true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('todos');
};

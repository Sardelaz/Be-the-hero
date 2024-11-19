
export const up = async (knex) => {
   return  knex.schema.createTable('incidents', function(table) {
        table.increments();

        table.string('title').notNullable();
        table.string('description').notNullable();
        table.decimal('value').notNullable();

        table.string('ong_id').notNullable()

        table.foreign('ong_id').references('id').inTable('ongs')
      });
};

export const down = async (knex) =>  {
  return knex.schema.dropTable('incidents')
};

exports.up = function (knex) {
  return knex.schema.createTable("sessions", (sessionsTable) => {
    sessionsTable.increments("session_id");
    sessionsTable.integer("user_id").notNullable();
    sessionsTable.integer("session_count").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sessions");
};

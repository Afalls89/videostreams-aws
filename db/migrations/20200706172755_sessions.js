exports.up = function (knex) {
  return knex.schema.createTable("sessions", (sessionsTable) => {
    sessionsTable.increments("session_id");
    sessionsTable.integer("user_id").notNullable();
    sessionsTable.integer("stream_count").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sessions");
};

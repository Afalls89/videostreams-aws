const testData = require("../testdata/index");
console.log(testData);

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("sessions").insert(testData);
    });
};

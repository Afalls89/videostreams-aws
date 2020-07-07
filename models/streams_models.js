const knex = require("../db/connection");

exports.fetchNewStream = (user_id) => {
  return knex
    .select("*")
    .from("sessions")
    .where({ user_id })
    .then(([session]) => {
      if (session.stream_count < 3) {
        return knex
          .increment("stream_count", 1)
          .from("sessions")
          .where("session_id", "=", session.session_id)
          .returning("*")
          .then(([updatedSession]) => {
            return {
              streamStatus: {
                isNewStreamAllowed: true,
                streamCount: updatedSession.stream_count,
              },
            };
          });
      }
    });
};

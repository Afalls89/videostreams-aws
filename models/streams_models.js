const knex = require("../db/connection");

exports.fetchNewStream = (user_id) => {
  if (isNaN(+user_id)) {
    return Promise.reject({
      status: 400,
      msg: "user_id is invalid , needs to be a number",
    });
  } else {
    return knex
      .select("*")
      .from("sessions")
      .where({ user_id })
      .then(([session]) => {
        if (!session) {
          return knex
            .insert({ user_id: user_id, stream_count: 1 })
            .into("sessions")
            .returning("*")
            .then(([session]) => {
              return {
                streamStatus: {
                  isNewStreamAllowed: true,
                  streamCount: session.stream_count,
                },
              };
            });
        }
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
        if (session.stream_count >= 3) {
          return {
            streamStatus: {
              isNewStreamAllowed: false,
              streamCount: session.stream_count,
            },
          };
        }
      });
  }
};

exports.fetchEndStream = (user_id) => {
  if (isNaN(+user_id)) {
    return Promise.reject({
      status: 400,
      msg: "user_id is invalid , needs to be a number",
    });
  } else {
  }
};

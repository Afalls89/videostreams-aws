const knex = require("../db/connection");

exports.fetchNewStream = (user_id) => {
  // if the user_id is equal to NaN when converted to a number
  // user_id is invalid and an error is thrown
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
        // if there is no session present for the user_id
        // then a session is created and stream count is set to one
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
          //if the session corresponding to the user_id has less than
          // three streams then stream count is incremented by 1
          // isNewStreamAllowed: true is returned with the new stream count
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
          //if the session corresponding to the user_id already has a
          // stream count of three, then isNewStreamAllowed is set to false,
          // and returned with  stream count
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
  // if the user_id is equal to NaN when converted to a number
  // user_id is invalid and an error is thrown
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
          // if there is no session present that corresponds to the user_id
          // error message s thrown
          return Promise.reject({
            status: 400,
            msg: "user_id not present in the database",
          });
        }
        if (session.stream_count > 0) {
          //if the session corresponding to the user_id has a stream count
          // greater than zero then the stream count is decreased by 1
          // msg: "stream closed", is returned with updated stream count
          return knex
            .decrement("stream_count", 1)
            .from("sessions")
            .where("session_id", "=", session.session_id)
            .returning("*")
            .then(([updatedSession]) => {
              return {
                streamStatus: {
                  msg: "stream closed",
                  streamCount: updatedSession.stream_count,
                },
              };
            });
        }
        if (session.stream_count === 0) {
          //if the session corresponding to the user_id has a stream count
          // of zero then error message is thrown
          return Promise.reject({
            status: 400,
            msg: "no active streams to close for user",
          });
        }
      });
  }
};

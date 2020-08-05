const AWS = require("aws-sdk");
process.env.NODE_ENV = "test"
  ? AWS.config.update({
      region: "eu-west-2",
      endpoint: "http://localhost:8000",
    })
  : AWS.config.update({ region: "eu-west-2" });

const docClient = new AWS.DynamoDB.DocumentClient();

exports.fetchNewStream = async (user_id) => {
  // if the user_id is equal to NaN when converted to a number
  // user_id is invalid and an error is thrown
  if (isNaN(+user_id)) {
    return Promise.reject({
      status: 400,
      msg: "user_id is invalid , needs to be a number",
    });
  } else {
    docClient.query(
      {
        TableName: "videostreams",
        KeyConditionExpression: "user_id = :Id",
        ExpressionAttributeValues: {
          ":Id": +user_id,
        },
      },
      (err, data) => {
        if (err) {
          console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
          console.log(data.Items, "Query succeeded.");
          return data.Items;
        }
      }
    );
    // query DB for session
    if (response.length === 0) {
      // if there is no  user present for user_id
      // then a session is created and stream count is set to one
      docClient.put(
        {
          TableName: "videostreams",
          Item: {
            user_id: user_id,
            session_count: 1,
          },
        },
        (err, data) => {
          if (err) {
            console.error(
              "Unable to add item. Error JSON:",
              JSON.stringify(err, null, 2)
            );
          } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            return data;
          }
        }
      );
    }
  }

  // if (response.stream_count < 3) {
  //   //if the session corresponding to the user_id has less than
  //   // three streams then stream count is incremented by 1
  //   // isNewStreamAllowed: true is returned with the new stream count
  // }

  // if (response.stream_count >= 3) {
  //   //if the session corresponding to the user_id already has a
  //   // stream count of three, then isNewStreamAllowed is set to false,
  //   // and returned with  stream count
  // }
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

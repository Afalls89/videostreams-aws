const AWS = require("aws-sdk");
process.env.NODE_ENV === "test"
  ? AWS.config.update({
      region: "eu-west-2",
      endpoint: "http://localhost:8000",
    })
  : AWS.config.update({ region: "eu-west-2" });

const docClient = new AWS.DynamoDB.DocumentClient();

const defaultUpdateParams = {
  TableName: "videostreams",
  Key: {
    user_id: "",
  },
  UpdateExpression: "",
  ExpressionAttributeValues: {
    ":sc": 1,
  },
  ReturnValues: "UPDATED_NEW",
};

const queryUser = (params) => {
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        reject(err);
      } else {
        console.log(data.Items, "Query succeeded.");
        resolve(data.Items);
      }
    });
  });
};

const updateUsersStreamCount = (params, additionalParams) => {
  updateParams = { ...params, ...additionalParams };
  return new Promise((resolve, reject) => {
    docClient.update(updateParams, (err, data) => {
      if (err) {
        console.error(
          "Unable to add item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
        reject(err);
      } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        resolve(data.Attributes.stream_count);
      }
    });
  });
};

exports.fetchNewStream = async (user_id) => {
  // if the user_id is equal to NaN when converted to a number
  // user_id is invalid and an error is thrown
  if (isNaN(+user_id)) {
    return Promise.reject({
      status: 400,
      msg: "user_id is invalid , needs to be a number",
    });
  } else {
    const user = await queryUser({
      TableName: "videostreams",
      KeyConditionExpression: "user_id = :Id",
      ExpressionAttributeValues: {
        ":Id": +user_id,
      },
    });

    if (user.length === 0) {
      // if there is no  user present for user_id
      // then a session is created and stream count is set to one
      // return new Promise((resolve, reject) => {
      const updatedStreamCount = await updateUsersStreamCount(
        defaultUpdateParams,
        {
          UpdateExpression: "set stream_count = :sc",
          Key: {
            user_id: +user_id,
          },
        }
      );
      return {
        streamStatus: {
          isNewStreamAllowed: true,
          streamCount: updatedStreamCount,
        },
      };
    }
    if (user[0].stream_count < 3) {
      // if the session corresponding to the user_id has less than
      // three streams then stream count is incremented by 1
      // isNewStreamAllowed: true is returned with the new stream count

      const updatedStreamCount = await updateUsersStreamCount(
        defaultUpdateParams,
        {
          Key: {
            user_id: +user_id,
          },
          UpdateExpression: "set stream_count = stream_count + :sc",
        }
      );
      return {
        streamStatus: {
          isNewStreamAllowed: true,
          streamCount: updatedStreamCount,
        },
      };
    }
    if (user[0].stream_count >= 3) {
      //   //if the session corresponding to the user_id already has a
      //   // stream count of three, then isNewStreamAllowed is set to false,
      //   // and returned with  stream count
      return {
        streamStatus: {
          isNewStreamAllowed: false,
          streamCount: user[0].stream_count,
        },
      };
    }
    // });
  }
};

exports.fetchEndStream = async (user_id) => {
  // if the user_id is equal to NaN when converted to a number
  // user_id is invalid and an error is thrown
  if (isNaN(+user_id)) {
    return Promise.reject({
      status: 400,
      msg: "user_id is invalid , needs to be a number",
    });
  } else {
    const user = await queryUser({
      TableName: "videostreams",
      KeyConditionExpression: "user_id = :Id",
      ExpressionAttributeValues: {
        ":Id": +user_id,
      },
    });
    if (user.length === 0) {
      // if there is no session present that corresponds to the user_id
      // error message s thrown
      return Promise.reject({
        status: 400,
        msg: "user_id not present in the database",
      });
    }
    if (user[0].stream_count > 0) {
      //if the session corresponding to the user_id has a stream count
      // greater than zero then the stream count is decreased by 1
      // msg: "stream closed", is returned with updated stream count
      const updatedStreamCount = await updateUsersStreamCount(
        defaultUpdateParams,
        {
          Key: {
            user_id: +user_id,
          },
          UpdateExpression: "set stream_count = stream_count - :sc",
        }
      );
      return {
        streamStatus: {
          msg: "stream closed",
          streamCount: updatedStreamCount,
        },
      };
    }
    if (user[0].stream_count === 0) {
      //if the session corresponding to the user_id has a stream count
      // of zero then error message is thrown
      return Promise.reject({
        status: 400,
        msg: "no active streams to close for user",
      });
    }
  }
};

const AWS = require("aws-sdk");
const testData = require("./testdata/index");

process.env.NODE_ENV = "test"
  ? AWS.config.update({
      region: "eu-west-2",
      endpoint: "http://localhost:8000",
    })
  : AWS.config.update({ region: "eu-west-2" });

const docClient = new AWS.DynamoDB.DocumentClient();

testData.forEach((videostream) => {
  const params = {
    TableName: "videostreams",
    Item: {
      user_id: videostream.user_id,
      stream_count: videostream.stream_count,
    },
  };

  docClient.put(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to add videostream",
        videostream.session_id,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("PutItem succeeded:", videostream.session_id);
    }
  });
});

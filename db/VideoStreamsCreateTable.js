const AWS = require("aws-sdk");
process.env.NODE_ENV = "test"
  ? AWS.config.update({
      region: "eu-west-2",
      endpoint: "http://localhost:8000",
    })
  : AWS.config.update({ region: "eu-west-2" });

const ddb = new AWS.DynamoDB();

const params = {
  TableName: "videostreams",
  KeySchema: [{ AttributeName: "user_id", KeyType: "HASH" }],
  AttributeDefinitions: [{ AttributeName: "user_id", AttributeType: "N" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

ddb.createTable(params, function (err, data) {
  if (err) {
    console.error(
      "Unable to create table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      "Created table. Table description JSON:",
      JSON.stringify(data, null, 2)
    );
  }
});

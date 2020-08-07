const AWS = require("aws-sdk");
process.env.NODE_ENV = "test"
  ? AWS.config.update({
      region: "eu-west-2",
      endpoint: "http://localhost:8000",
    })
  : AWS.config.update({ region: "eu-west-2" });

const ddb = new AWS.DynamoDB();

ddb.deleteTable({ TableName: "videostreams" }, (err, data) => {
  if (err) {
    console.error(
      "Unable to delete table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      "Deleted table. Table description JSON:",
      JSON.stringify(data, null, 2)
    );
  }
});

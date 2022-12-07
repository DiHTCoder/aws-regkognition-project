var AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  sessionToken: AWS_SESSION_TOKEN,
  region: AWS_REGION,
});

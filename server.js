const express = require("express");
const { S3Client } = require("@aws-sdk/client-s3");
const bodyParser = require("body-parser");
const multerS3 = require("multer-s3");
const multer = require("multer");
const aws = require("aws-sdk");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("view"));

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
    },
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
});
const bucketName = "testrekogni";
const rekognition = new aws.Rekognition();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});


const upload = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/octet-stream" ||
      file.mimetype === "video/mp4" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  storage: multerS3({
    acl: "public-read",
    s3: s3,
    bucket: bucketName,
    key: function (req, image, cb) {
      req.image = Date.now() + image.originalname;
      cb(null, Date.now() + image.originalname);
    },
  }),
});

app.post("/upload", upload.single("image"), (req, res) => {
  res.send({ image: req.image });
});

app.post("/detectTest", (req, res) => {
  var params = {
    Image: {
      S3Object: {
        Bucket: bucketName,
        Name: req.body.name,
      },
    },
  };
  rekognition.detectLabels(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else {
      labelData = data.Labels;
      // console.log(labelData);
      finalResult = {
        text: {},
        celebrities: {},
      };
      let textFlag = false;
      let personFlag = false;
      let AllTypeFlag = false;
      for (let i = 0; i < labelData.length; i++) {
        if (labelData[i].Name === "Text") {
          textFlag = true;
          continue;
        }
        if (labelData[i].Name === "Page") {
          textFlag = true;
          continue;
        }
        if (labelData[i].Name === "Paper") {
          textFlag = true;
          continue;
        }
        if (labelData[i].Name === "Person") {
          personFlag = true;
          continue;
        }
        if (labelData[i].Name === "Human") {
          personFlag = true;
          continue;
        }
        if (labelData[i].Name === "Face") {
          personFlag = true;
          continue;
        }
        if (labelData[i].Name === "Poster") {
          textFlag = true;
          continue;
        }
      }
      if (textFlag && personFlag) {
        AllTypeFlag = true;
        textFlag = false;
        personFlag = false;
      }
      if (textFlag) {
        textResult = {};
        textParam = {
          Image: {
            S3Object: {
              Bucket: bucketName,
              Name: req.body.name,
            },
          },
        };
        rekognition.detectText(textParam, function (err, data) {
          if (err) console.log(err, err.stack);
          else {
            finalResult.text = data;
            finalResult.celebrities = null;
            res.send({ data: finalResult });
          }
        });
      }
      if (personFlag) {
        personParam = {
          Image: {
            S3Object: {
              Bucket: bucketName,
              Name: req.body.name,
            },
          },
        };
        rekognition.recognizeCelebrities(personParam, function (err, data) {
          if (err) console.log(err, err.stack);
          else {
            finalResult.text = null;
            finalResult.celebrities = data;
            res.send({ data: finalResult });
          }
        });
      }
      if (AllTypeFlag) {
        posterParam = {
          Image: {
            S3Object: {
              Bucket: bucketName,
              Name: req.body.name,
            },
          },
        };
        rekognition.detectText(allTypeParam, function (err, data) {
          if (err) console.log(err, err.stack);
          else {
            finalResult.text = data;
            rekognition.recognizeCelebrities(
              allTypeParam,
              function (err, data) {
                if (err) console.log(err, err.stack);
                else {
                  finalResult.celebrities = data;
                }
              }
            );
            res.send({ data: finalResult });
          }
        });
      }
    }
  });
});

app.post("/detectFace", (req, res) => {
  console.log(req.body.name);
  var params = {
    Attributes: ["ALL"],
    Image: {
      S3Object: {
        Bucket: bucketName,
        Name: req.body.name,
      },
    },
  };
  rekognition.detectFaces(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else {
      console.log(data);
      res.send({ data: data });
    }
  });
});
app.post("/detectText", (req, res) => {
  var params = {
    Filters: {
      WordFilter: {
        MinConfidence: 80,
        //MinBoundingBoxWidth
        //MinBoundingBoxHeight
      },
    },
    Image: {
      S3Object: {
        Bucket: bucketName,
        Name: req.body.name,
      },
    },
  };
  rekognition.detectText(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
      res.send({ data: data });
    }
  });
});
app.post("/detectLabel", (req, res) => {
    var params = {
        Image: {
            S3Object: {
                Bucket: bucketName,
                Name: req.body.name,
            },
        },
    };
    rekognition.detectLabels(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
            res.send({ data: data });
        }
    });
});

app.post("/recognizeCeleb", (req, res) => {
    var params = {
        Image: {
            S3Object: {
                Bucket: bucketName,
                Name: req.body.name,
            },
        },
    };
    rekognition.recognizeCelebrities(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
            res.send({ data: data });
        }
    });
});

app.listen(3000, () => console.log("Server is running on port 3000"));

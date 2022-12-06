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
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
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

app.post("/detectFace", (req, res) => {
    console.log(req.body.name);
    var params = {
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
app.post("detectText", upload.array("image", 1), (req, res) => {
    var params = {
        Image: {
            S3Object: {
                Bucket: bucketName,
                Name: req.file,
            },
        },
    };
    console.log(req.file);
    textDetection(params, res);
});
function textDetection(params, res) {
    rekognition.detectText(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else {
            console.log(data);
            res.send({ data: data });
        }
    });
}

app.listen(3000, () => console.log("Server is running on port 3000"));

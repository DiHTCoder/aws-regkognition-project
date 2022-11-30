const express = require("express");
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

const s3 = new aws.S3({});
const bucketName = "test";
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
        key: function (req, file, cb) {
            req.file = Date.now() + file.originalname;
            cb(null, Date.now() + file.originalname);
        },
    }),
});

app.post("/detectFace", upload.single("image"), (req, res) => {
    var params = {
        Image: {
            S3Object: {
                Bucket: bucketName,
                Name: req.file,
            },
        },
    };
    console.log(req.file);
    // rekognition.detectFaces(params, function (err, data) {
    //     if (err) console.log(err, err.stack);
    //     else {
    //         console.log(data);
    //         res.send({ data: data });
    //     }
    // });
});

app.listen(3000, () => console.log("Server is running on port 3000"));

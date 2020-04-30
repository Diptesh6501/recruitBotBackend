const express = require('express');
var bodyParser = require('body-parser');
const multer = require('multer');
const connectMongo = require('./config/connection');
const app = express();
const port = 8080
const parseResume = require('./services/extractResumeInfo');

connectMongo();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// var upload = multer({dest:'./upload/'});

var storage = multer.diskStorage(
    {
        destination: './uploads/',
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }
);

var upload = multer({ storage: storage });


app.post('/uploadFile', upload.single('file'), async (req, res) => {
    fileParsedPath = './uploads/' + req.file.originalname;
    parseResume(req.file.originalname).then((data) => {
        res.json({
            'parsedResumeInformation': JSON.stringify(data)
        });
    }).catch((error) => {
        console.log('errror', error);
    })

});

app.listen(port, (err, res) => {
    if (err) {
        console.error(err);
    }
    console.log(`node is running in ${port}`);
})


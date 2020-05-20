const express = require('express');
var bodyParser = require('body-parser');
const multer = require('multer');
const connectMongo = require('./config/connection');
const app = express();
const port = 8080
const parseResume = require('./services/extractResumeInfo');
const candidate = require('./models/candidate.model');
const AWS = require('aws-sdk');
const fs = require('fs');
const routes = require('./routes/index');
const candidateDataTransaction = require('./controllers/candidate');
let lastSavedCandidateId;
let fileToBeServed;
let originalFileName;

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

app.use(routes);

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

const s3 = new AWS.S3({
    accessKeyId: 'AKIAJAHCMTAEUPCMNBLQ',
    secretAccessKey: '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'
});

app.post('/parseResume', upload.single('file'), async (req, res) => {
    fileParsedPath = './uploads/' + req.file.originalname;
    fileToBeServed =  req.file.originalname;
    console.log(__dirname +'/uploads/'+ fileToBeServed);
    parseResume(req.file.originalname).then((data) => {
        res.json({
            'parsedResumeInformation': JSON.stringify(data)
        });
    }).catch((error) => {
        console.log('errror', error);
    })

});

app.post('/saveCandidateInfo', async (req, res) => {
    let userId = 'cand' + '-' + Math.floor(1000 + Math.random() * 9000);
    lastSavedCandidateId = userId;
    let candidateSchema = new candidate({
        candidateId: userId,
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        skills: req.body.skills,
        cCtc: req.body.cCtc,
        eCtc: req.body.eCtc,
        url: ''
    });
    candidateSchema.save((err) => {
        if (err) {
            throw err
        }
        res.json({
            candidateInfoSaved: candidateSchema
        })
    });
});



async function findLastSavedCandidate(awsUrl) {
    return new Promise(function (resolve, reject) {
        let query = { candidateId: lastSavedCandidateId };
        candidate.findOneAndUpdate(query, { url: awsUrl }, { new: true }, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data);
        })
    })

}

// get pdf
app.get('/pdf', (req, res) => {
    res.sendFile(`/uploads/${fileToBeServed}` , { root: __dirname });
});

function uploadFileToAws(file) {
    return new Promise(function (resolve, reject) {
        fs.readFile('./uploads/' + file.originalname, (err, data) => {
            if (err) throw err;
            const params = {
                Bucket: 'turtlebowl',
                Key: file.originalname,
                ACL: 'public-read',
                ContentType: file.mimetype,
                Body: JSON.stringify(data)
            };
            s3.upload(params, function (s3Err, data) {
                if (s3Err) {
                    reject(error);
                }
                console.log(`File uploaded successfully at ${data.Location}`)
                // data.Location is a aws url
                findLastSavedCandidate(data.Location).then(data => {
                    resolve(data);
                });
            });
        });
    });
};

app.post('/uploadAws', upload.single('file'), (req, res) => {
    originalFileName = req.file.originalname;
    uploadFileToAws(req.file).then(data => {
        res.json({
            candidateDetails: data
        })
    })
})



app.listen(port,'0.0.0.0' , (err, res) => {
    if (err) {
        console.error(err);
    }
    console.log(`node is running in ${port}`);
});


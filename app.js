const express = require('express');
var bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 8080
const pdf = require('pdf-parse');
const ResumeParser = require('simple-resume-parser');
const extractInfo = require('./services/extractInfo');
const extractPhoneNumber = require('./services/extractPhoneNumber');
let parsedDocument;
let parsedInfo = {};
let foundSkills = [];
let availableSkills = ['angular', 'react', 'java', 'qa', 'node',
    'c#', 'asp.net', 'vb', 'visual basic', 'spring boot'];
let toolsTextPattern = ['jenkins', 'ci/cd', 'maven', 'circleci', 'aws', 'selenium'];
let ideTextPattern = ['webstorm', 'code', 'visual studio', 'eclipse', 'sublime text'];
let phoneNoTextPattern = ['phone', 'phno', 'Mob', 'Mobile', 'number']
let fileParsedPath;

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
    console.log(req.file);
    console.log('original Name', req.file.originalname);
    fileParsedPath = './uploads/' + req.file.originalname;
    parseResume(fileParsedPath).then((data) => {
        res.json({
            'parsedResumeInformation': JSON.stringify(data)
        });
    }).catch((error) => {
        console.log('errror', error);
    })

});
function parseResume(path) {
    return new Promise((resolve, reject) => {

        if (path) {
            const resume = new ResumeParser(path);
            resume.parseToJSON()
                .then(async data => {
                    parsedDocument = data.parts;
                    console.log('parsed document', parsedDocument);

                    // extracting  name 
                    if (parsedDocument.name) {
                        parsedInfo.name = parsedDocument.name;
                    }
                    //extracting email 
                    if (parsedDocument.email) {
                        parsedInfo.email = parsedDocument.email;
                    }
                    // extracting skills from technology section 
                    if (Boolean(data.parts.hasOwnProperty('technology'))) {
                        let splittedTechnology = parsedDocument.technology.split(',');
                        parsedInfo.skills = [...new Set(await extractInfo(availableSkills, splittedTechnology))];
                        parsedInfo.tools = [...new Set(await extractInfo(toolsTextPattern, splittedTechnology))];
                        parsedInfo.ide = [...new Set(await extractInfo(ideTextPattern, splittedTechnology))];

                    }
                    // extracting skills from skills
                    if (Boolean(data.parts.hasOwnProperty('skills'))) {
                        let splittedSkills = parsedDocument.skills.split(',');
                        parsedInfo.skills = [...new Set(await extractInfo(availableSkills, splittedSkills))];
                        parsedInfo.tools = [...new Set(await extractInfo(toolsTextPattern, splittedSkills))];
                        parsedInfo.ide = [...new Set(await extractInfo(ideTextPattern, splittedSkills))];


                    }
                    // extracting phone number
                    if (Boolean(data.parts.hasOwnProperty('summary'))) {
                        let splittedSummary = parsedDocument.summary.split(',');
                        parsedInfo.phoneNumber = await extractPhoneNumber(phoneNoTextPattern, splittedSummary);
                    }
                    console.log('parsed info', parsedInfo);
                    resolve(parsedInfo)

                })
                .catch(error => {
                    console.error(error);
                    reject('file path is required');

                });
        }
    })
}




app.get('/', (req, res) => {
    res.send({
        'message': 'welcome to recruit boot ai'
    })
})




app.listen(port, (err, res) => {
    if (err) {
        console.error(err);
    }
    console.log(`node is running in ${port}`);
})


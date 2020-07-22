const fs = require('fs');
const findKeyWordInResume = require('./readResume');
const path = require('path');
const candidate = require('../models/candidate.model');



function getCandidateByKeyword(searchText) {
    let candidateData;
    let directoryPath = path.join('./../resumes');
    let flag = 0;
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
                throw err
            }
            for (let i = 0; i < files.length; i++) {
                findKeyWordInResume(files[i], searchText).then((parsedData) => {
                    flag++;
                    if (parsedData.count > 0) {
                        let fileName = parsedData.fileName;
                        candidate.find({ filename: fileName }, (err, data) => {
                            if (err) {
                                throw err;
                            }
                            candidateData = data.concat(data);
                            console.log('candidate data here in service', data);
                            if (flag === files.length) {
                                resolve(candidateData);
                            }
                        })
                    }
                    if (candidateData === undefined && flag === files.length) {
                        resolve(candidateData)
                    }
                });
            }
        });
    })
}

module.exports = getCandidateByKeyword;
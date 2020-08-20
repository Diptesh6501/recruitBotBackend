const candidate = require('../models/candidate.model');
const path = require('path');
const utility = require('../services/util');
const fs = require('fs');
const async = require('async');
const getCandidateByKeyword = require('../services/getCandidateByKeyword');


let userId = '';


const candidateDataTransaction = {
    candidateGetAll: async function (req, res) {
        candidate.find({}, (err, data) => {
            if (err) {
                throw err
            }
            res.json({
                candidates: data
            })
        })
    },
    candidateById: async function (req, res) {
        let candidateId = req.query.id;
        candidate.find({ candidateId: candidateId }, (err, data) => {
            if (data) {
                res.json({
                    candidateDetail: data
                })
            } else {
                res.json({
                    candidateDetail: 'No candidate was found'
                })
            }
        })
    },
    searchCandidate: async function (req, res) {
        const searchText = req.body.searchText;
        candidate.find({ skills: { $in: [new RegExp(searchText, 'i')] } }, (err, data) => {
            if (err) {
                throw err;
            } else if (Boolean(data.length)) {
                res.json({
                    status: true,
                    candidateDetail: data
                })
            } else if (!Boolean(data.length)) {
                let candidateData = [];
                let directoryPath = path.join('../resumes');
                getCandidateByKeyword(searchText).then((data) => {
                    console.log('data here in candidate.js', data);
                    if (data != undefined) {
                        res.json({
                            status: true,
                            candidateDetail: data
                        })
                    } else if (data === undefined) {
                        res.json({
                            status: false,
                            candidateDetail: 'No candidate was found'
                        })
                    }
                })
            }
        })
    },
    findLastSavedCandidate: async function (lastSavedCandidateId, awsUrl, res) {
        let query = { candidateId: lastSavedCandidateId };
        candidate.findOneAndUpdate(query, { url: awsUrl }, { new: true }, (err, data) => {
            if (err) {
                throw err
            }
            // return data;
            res.json({
                candidateInfoSaved: data
            })
        })
    },
    downloadFile: async function (req, res) {
        filename = req.params.file;
        let fileLocation = path.join('../resumes', filename);
        res.download(fileLocation, filename, (err) => {
            if (err) {
                throw err;
            }
        });
    },
    saveNewCandidate: async function (req, res) {
        userId = 'cand' + '-' + Math.floor(1000 + Math.random() * 9000);
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
            currentLocation: req.body.currentLocation,
            filename: ''
        });
        candidateSchema.save((err) => {
            if (err) {
                throw err
            }

            utility.setLastSavedUserId(userId);
            res.json({
                candidateInfoSaved: candidateSchema
            })
        });
    },
    viewFile: function (req, res) {
        let fileName = req.query.fileName;
        let filePath = path.join(__dirname, '../../resumes', fileName)
        res.sendFile(filePath);
    },
    updateCandidate: function (req, res) {
        let query = { candidateId: req.body.candidateId };
        candidate.findOneAndUpdate(query,
            {
                fName: req.body.fName,
                lName: req.body.lName,
                email: req.body.email,
                phoneNo: req.body.phoneNo,
                skills: req.body.skills,
                cCtc: req.body.cCtc,
                eCtc: req.body.eCtc,
                currentLocation: req.body.currentLocation
            }, { new: true }, (err, data) => {
                if (err) {
                    throw err
                }
                res.json({
                    updated: true,
                    updateCandidate: data
                });
            })
    },
    deleteCandidate: function (req, res) {
        let filename = req.params.filename;
        let filePath = path.join(__dirname, '../../resumes', filename)
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err)
                    return
                } else {
                    candidate.deleteOne({ candidateId: req.params.candidateId }, function (err, data) {
                        if (err) {
                            throw err;
                        }
                        res.json({
                            deleted: 'sucessfully',
                            delete: data
                        })
                    });
                }
            })

        }
    },
    advancedSearch: function (req, res) {
        let searchResults;
        console.log('req', req.body);
        async.waterfall([
            function searchName(done) {
                if (req.body.location && !req.body.ctc) {
                    candidate.find({ currentLocation: { $regex: req.body.location, $options: "i" } }, (err, data) => {
                        if (err) {
                            throw err
                        }
                        searchResults = data;
                        done(null, data);
                    })
                } else {
                    done(null, '');
                }
            },
            function searchEmail(step1Result, done) {
                if (req.body.ctc && !req.body.location) {
                    candidate.find({ cCtc: { $regex: req.body.ctc, $options: "i" } }, (err, data) => {
                        if (err) {
                            throw err
                        }
                        if (searchResults != null || searchResults != undefined) {
                            searchResults.concat(data)
                        } else {
                            searchResults = data;
                        }
                        done(null, data);

                    })
                } else {
                    done(null, '');
                }
            },
            function searchPhoneNo(step2Result, done) {
                if (req.body.ctc && req.body.location) {
                    candidate.find({
                        cCtc: req.body.ctc,
                        currentLocation: { $regex: req.body.location, $options: "i" }
                    }, (err, data) => {
                        if (err) {
                            throw err;
                        }
                        searchResults = data;
                        done(null);
                    });
                } else {
                    done(null);
                }
            }
        ],
            function (err) {
                if (err) {
                    throw new Error(err);
                } else {
                    res.json({
                        searchResult: searchResults
                    })
                }
            });
    },
}

module.exports = candidateDataTransaction;
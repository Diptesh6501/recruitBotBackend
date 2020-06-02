const candidate = require('../models/candidate.model');
const path = require('path');
const utility = require('../services/util');
const fs = require('fs');
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
        candidate.find({skills: { $regex: searchText, $options: "i" }}, (err, data) => {
            if (err) {
                throw err
            }
            res.json({
                candidateDetail: data
            })
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
        res.download(fileLocation, filename, (err)=>{
            if(err){
                throw err;
            }
        });
    },
    saveNewCandidate: async function(req,res){
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
    viewFile: function(req,res){
       let fileName = req.query.fileName;
       let filePath = path.join(__dirname , '../../resumes' , fileName)
       res.sendFile(filePath);
    },
    updateCandidate: function(req,res){
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
    deleteCandidate: function(req,res) {
            let filename = req.params.filename;
            console.log('file nae is', filename);
            let filePath = path.join( __dirname , '../../resumes' , filename)
            console.log('filename exsists', fs.existsSync(filePath));
            console.log('file path is', filePath);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                    console.error(err)
                    return
                    } else {
                        candidate.deleteOne({ candidateId: req.params.candidateId }, function (err,data) {
                            if(err){
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
    }
}

module.exports = candidateDataTransaction;
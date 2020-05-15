const candidate = require('../models/candidate.model');
const AWS = require('aws-sdk');
const fs = require('fs');

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
        console.log('search text', this.searchText);
        candidate.find({ skills: { $regex: searchText } }, (err, data) => {
            if (err) {
                throw err
            }
            res.json({
                candidateDetail: data
            })
        })
    },
     findLastSavedCandidate: async function(lastSavedCandidateId, awsUrl, res) {
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
    }
}

module.exports = candidateDataTransaction;
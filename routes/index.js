const express = require('express');
const candidateDataTransaction = require('../controllers/candidate');
const routes = express();

routes.get('/getAllCandidates', candidateDataTransaction.candidateGetAll);
routes.get('/getCandidateById', candidateDataTransaction.candidateById);
routes.post('/searchCandidates', candidateDataTransaction.searchCandidate);
routes.get('/download/:file', candidateDataTransaction.downloadFile);
routes.post('/saveCandidateInfo', candidateDataTransaction.saveNewCandidate);

module.exports = routes;
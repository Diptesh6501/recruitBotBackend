const express = require('express');
const candidateDataTransaction = require('../controllers/candidate');
const routes = express();

routes.get('/getAllCandidates', candidateDataTransaction.candidateGetAll);
routes.get('/getCandidateById', candidateDataTransaction.candidateById);
routes.post('/searchCandidates', candidateDataTransaction.searchCandidate);
routes.get('/download/:file', candidateDataTransaction.downloadFile);
routes.post('/saveCandidateInfo', candidateDataTransaction.saveNewCandidate);
routes.get('/viewFile', candidateDataTransaction.viewFile);
routes.put('/updateCandidate', candidateDataTransaction.updateCandidate);
routes.delete('/deleteCandidate/:candidateId/:filename', candidateDataTransaction.deleteCandidate);
routes.post('/advSearch', candidateDataTransaction.advancedSearch);
routes.post('/keyWordSEarch', candidateDataTransaction.keyWordSearch);
module.exports = routes;
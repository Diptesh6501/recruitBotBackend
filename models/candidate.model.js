const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const candidateSchema = new Schema({
    candidateId: String,
    fName: String,
    lName: String,
    email: String,
    phoneNo: String,
    skills: [String],
    cCtc: Number,
    eCtc: Number,
    url: String
});

module.exports = mongoose.model('candidate', candidateSchema);



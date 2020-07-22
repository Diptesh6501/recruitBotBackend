const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const keywordSchema = new Schema({
    'name': String,
    'count': { type: Number, default: 0 },
    'type': String
});

module.exports = mongoose.model('keyword', keywordSchema);



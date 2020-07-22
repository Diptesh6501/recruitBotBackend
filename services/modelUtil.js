const KeywordModel = require('../models/keyword.model');

const modelUtility = {
    findAndSaveSkillKeywords: async function (keywords) {
        KeywordModel.find({}, (err, res) => {
            if (err) {
                throw err;
            }

            const existingKeywords = [];
            res.forEach(({ name, count }, index) => {
                if (keywords.includes(name)) {
                    existingKeywords.push(name);
                    res[index].count = ++count;
                    res[index].save();
                }
            });

            const newKeywordData = [];
            keywords.forEach(keyword => {
                if (!existingKeywords.includes(keyword)) {
                    newKeywordData.push({ name: keyword, count: 1, type: 'skill' });
                }
            });

            if (newKeywordData.length) {
                KeywordModel.insertMany(newKeywordData).then((response) => {
                    return response;
                });
            }

        });
    }
}

module.exports = modelUtility;
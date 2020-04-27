const utility = require('./util');

async function extractPhoneNumber(patterns, datas) {
    for (let pattern of patterns) {
        for (let data of datas) {
            if (data.includes(pattern)) {
                return await utility.validatePhoneNumber(data.match(/\d+/g));                
            }
        }
    }
}

module.exports = extractPhoneNumber;
const ResumeParser = require('simple-resume-parser');
const extractInfo = require('./extractInfo');
const extractPhoneNumber = require('./extractPhoneNumber');

function parseResume(fileName) {
    let parsedInfo = {};
    let parsedDocument;
    let fullPath = '.././resumes/' + fileName;
    let availableSkills = ['angular', 'react', 'java', 'qa', 'node',
        'c#', 'asp.net', 'vb', 'visual basic', 'spring boot', 'mqsql', 'mongo db', ];
    let toolsTextPattern = ['jenkins', 'ci/cd', 'maven', 'circleci', 'aws', 'selenium'];
    let ideTextPattern = ['webstorm', 'code', 'visual studio', 'eclipse', 'sublime text'];
    let phoneNoTextPattern = ['phone', 'phno', 'Mob', 'Mobile', 'number']
    return new Promise((resolve, reject) => {

        if (fullPath) {
            const resume = new ResumeParser(fullPath);
            resume.parseToJSON()
                .then(async data => {
                    parsedDocument = data.parts;
                    // extracting  name 
                    if (parsedDocument.name) {
                        parsedInfo.name = parsedDocument.name;
                    }
                    //extracting email 
                    if (parsedDocument.email) {
                        parsedInfo.email = parsedDocument.email;
                    }
                    // extracting skills from technology section 
                    if (Boolean(data.parts.hasOwnProperty('technology'))) {
                        let splittedTechnology = parsedDocument.technology.split(',');
                        parsedInfo.skills = [...new Set(await extractInfo(availableSkills, splittedTechnology))];
                        parsedInfo.tools = [...new Set(await extractInfo(toolsTextPattern, splittedTechnology))];
                        parsedInfo.ide = [...new Set(await extractInfo(ideTextPattern, splittedTechnology))];

                    }
                    // extracting skills from skills
                    if (Boolean(data.parts.hasOwnProperty('skills'))) {
                        let splittedSkills = parsedDocument.skills.split(',');
                        parsedInfo.skills = [...new Set(await extractInfo(availableSkills, splittedSkills))];
                        parsedInfo.tools = [...new Set(await extractInfo(toolsTextPattern, splittedSkills))];
                        parsedInfo.ide = [...new Set(await extractInfo(ideTextPattern, splittedSkills))];


                    }
                    // extracting phone number
                    if (Boolean(data.parts.hasOwnProperty('summary'))) {
                        let splittedSummary = parsedDocument.summary.split(',');
                        parsedInfo.phoneNumber = await extractPhoneNumber(phoneNoTextPattern, splittedSummary);
                    }
                    resolve(parsedInfo)

                })
                .catch(error => {
                    console.error(error);
                    reject('file path is required');

                });
        }
    })
}

module.exports = parseResume;
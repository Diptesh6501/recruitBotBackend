const ResumeParser = require('simple-resume-parser');

function findKeyWordInResume(file, searchKeyWord) {
    let fullPath = '.././resumes/' + file;
    let count = 0;
    return new Promise((resolve, reject) => {
        const resume = new ResumeParser(fullPath);
        resume.parseToJSON()
            .then(async data => {
                let map = data.parts;
                let pattern = searchKeyWord.toLowerCase();
                let keys = Object.keys(map);
                for (let key of keys) {
                    let splittedText = map[key].split(",");
                    for (let s of splittedText) {
                        let s1 = s.toLowerCase();
                        if (Boolean(s1.includes(pattern))) {
                            count++;
                        }
                    }
                }
                resolve({
                    fileName: file,
                    count: count
                })
            })
            .catch(error => {
                console.error(error);
                reject('file path is required');
            });
    })
}
module.exports = findKeyWordInResume;
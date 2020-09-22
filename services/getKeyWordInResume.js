async function getKeyWordInresume(candidates, searchText) {
    return new Promise((resolve, reject) => {
        let result = [];
        let text = searchText.toLowerCase();
        for (let i = 0; i < candidates.length; i++) {
            if (candidates[i].resumeTxt && candidates[i].resumeTxt.length) {
                let currentCandidateResumeText = candidates[i].resumeTxt.toLowerCase();
                if (currentCandidateResumeText.includes(text)) {
                    result.push(candidates[i]);
                    console.log(i, candidates.length - 1)

                }
                if (i === candidates.length - 1 && result.length ) {
                    resolve(result);
                }

                if (i === candidates.length - 1 && !result.length ) {
                    reject(result);
                }
            }
        }
    });
}


module.exports = getKeyWordInresume;
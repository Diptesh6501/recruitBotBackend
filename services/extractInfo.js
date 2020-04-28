async function extractInfo(patterns , datas){
    let result  = [];
    for(let pattern of patterns){
        for(let data of datas){
            if(data.toLowerCase().includes(pattern.toLowerCase())){
               result.push(pattern);
            }
        }
    }
    return  [...new Set(result)];
    
}


module.exports = extractInfo;
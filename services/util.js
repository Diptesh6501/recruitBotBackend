let  lastSavedUserId= '';
let  resumeText = '';
let  fileName = '';
const utility = {
     validatePhoneNumber:  async function(number){
          if(number.length >= 2){
              return number[0] +'-'+number[1];
          } else if(number.length == 1){
              return number[0];
          }
    },
    setLastSavedUserId: function(id){
        lastSavedUserId = id;
        console.log('setlastsaveduser id', lastSavedUserId);
    },
    getLastSavedUserId: function(){
        return  lastSavedUserId;
    },
    setresumeAsText(text){
        this.resumeText = text;
    },
    getresumeAsText(){
        return this.resumeText;
    },
    setFileName(fileName){
        this.fileName = fileName;
    },
    getFileName(){
        return this.fileName;
    }
}


module.exports = utility;
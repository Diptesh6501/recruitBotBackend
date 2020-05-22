let  lastSavedUserId= '';
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
    }
}


module.exports = utility;
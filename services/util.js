const utility = {
  
     validatePhoneNumber:  async function(number){
          if(number.length >= 2){
              return number[0] +'-'+number[1];
          } else if(number.length == 1){
              return number[0];
          }
    },
}


module.exports = utility;
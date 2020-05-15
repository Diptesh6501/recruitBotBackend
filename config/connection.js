var mongoose = require('mongoose');

//connect
function connectMongo(){
try {
    mongoose.connect('mongodb://localhost:27017/candidate', { useNewUrlParser: true });
    console.log('connected to mongo !!!!');    
  } catch (error) {
     console.log(error);
  }
}

module.exports = connectMongo;
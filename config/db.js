const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//create an arrow function to call server.js asyncronously
//always put inside a try/catch to fail and show errors if connnection fails
// mongoose.connect returns a promise so add in an await
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    console.log('MongoDB Connected');
  } catch(err){
    console.error(err.message);

    //Exit process with failure
    process.exit(1);
  }
}


module.exports = connectDB;
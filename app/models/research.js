var mongoose = require('mongoose');

var researchSchema = mongoose.Schema({
    title:{
      type: String,
      required: true
      },
      body:{
        type: String,
        required: true
      },
      user_id:{
         type: String,
         required: true
      }
  });

var Research = module.exports = mongoose.model('Research', researchSchema);

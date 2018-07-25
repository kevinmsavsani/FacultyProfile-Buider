var mongoose = require('mongoose');

var studentsSchema = mongoose.Schema({
    name:{
      type: String,
      required: true
      },
      Name:{
        type: String,
        required: true
        },
    dept:{
          type: String,
          required: true
      },
    title:{

        type: String
    }

});

var Student = module.exports = mongoose.model('Student', studentsSchema);

var mongoose = require('mongoose');

// Article Schema
var teachingSchema = mongoose.Schema({
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

var Teaching = module.exports = mongoose.model('Teaching', teachingSchema);

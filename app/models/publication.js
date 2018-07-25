var mongoose = require('mongoose');

// Article Schema
var publicationSchema = mongoose.Schema({
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

var Publication = module.exports = mongoose.model('Publication', publicationSchema);

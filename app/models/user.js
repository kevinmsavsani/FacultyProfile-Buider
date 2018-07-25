const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },


    password:{
        type: String,
        required: true
    },

    security:{
        type:String,
        required:true
    },

    facebookID:{
        type: Number,
        required: true
    },

    contactNo:{
        type:Number,
        required:true
    },

    designation:{
        type: String,
        required:true
    },

    department:{
        type:String,
        required:true
    },

    room:{
        type:String,
        required:true
    },

    linkedin:{
        type:String,
        required:true
    },

    education:{
        type:String,
        required:true
    },


    research_interest:{
        type:String,
        required:true
    },

    experience:{
        type:String,
        required:true
    },

});

const User = module.exports = mongoose.model('User', UserSchema);

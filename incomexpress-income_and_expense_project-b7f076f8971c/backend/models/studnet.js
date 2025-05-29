const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    totalamount:{
        type:Number,
        required:true
    },
    paidamount:{
        type:Number,
        required:true
    },
    remainingamount:{
        type:Number,
        required:true
    },
    collegename:{
        type:String,
        required:true
    },
    domain:{
        type:String,
        required:true
    },
    projecttitle:{
        type:String,
        required:true
    },
},{timestamps:true});

const studentModel = mongoose.model('Studentdetails',StudentSchema);

module.exports = studentModel;


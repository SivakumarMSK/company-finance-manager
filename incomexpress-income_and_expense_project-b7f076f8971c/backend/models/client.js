const mongoose = require('mongoose')
const ClientSchema = new mongoose.Schema({
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
    companyname:{
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

const clientModel = mongoose.model('Clientdetails',ClientSchema);

module.exports = clientModel;
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    expensename:{
        type:String,
        required:true
    },
    expenseamount:{
        type:Number,
        required:true
    },
    expensecategory:{
        type:String,
        required:true
    },
    expensedate:{
        type:Date,
        required:true
    }
},{timestamps:true});                                   
  
const expenseModel = mongoose.model('Expensedetails',ExpenseSchema);

module.exports = expenseModel;
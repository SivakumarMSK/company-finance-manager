const express = require("express");
const {AddStudent} = require("../service/student.service");
const {DisplayStudent} = require("../service/student.service")
const{EditStudent} = require("../service/student.service")
const{DeleteStudent} = require("../service/student.service")
const{StudentIncome} = require('../service/student.service')
const{StudentCount} = require('../service/student.service')
const {AddExcelData} = require("../service/student.service")
const{StudentTransaction} = require('../service/student.service')

const router = express.Router();

router.post("/addstudent", AddStudent);
router.get("/displaystudent",DisplayStudent);
router.put("/updatestudent/:id", EditStudent);
router.delete("/deletestudent/:id",DeleteStudent);
router.get('/studentincome',StudentIncome);
router.get('/studentcount',StudentCount);
router.post("/importstudents",AddExcelData);
router.get('/studenttransaction',StudentTransaction);

module.exports = router;
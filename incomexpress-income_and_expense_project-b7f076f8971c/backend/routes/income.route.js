const express = require("express");
const { GetClientIncome, GetStudentIncome } = require("../service/income.service");


const Router = express.Router();

Router.get("/client-income",GetClientIncome);
Router.get("/student-income",GetStudentIncome);

module.exports = Router;
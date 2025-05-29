const express = require("express");

const{AddExpense,GetExpenses,UpdateExpense,DeleteExpense, ExpenseTransaction,ExpenseAmount} = require("../service/expense.service");

const router = express.Router();
router.post("/addexpense",AddExpense);
router.get("/getexpenses",GetExpenses);
router.put("/updateexpense/:id",UpdateExpense);
router.delete("/deleteexpense/:id",DeleteExpense);
router.get("/expensetransaction",ExpenseTransaction)
router.get("/expenseAmount",ExpenseAmount);
module.exports = router;
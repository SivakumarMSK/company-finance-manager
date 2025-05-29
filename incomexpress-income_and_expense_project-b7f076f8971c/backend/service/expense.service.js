const expenseModel = require('../models/expense');

const AddExpense = async (req, res) => {
    const { expensename, expenseamount, expensecategory, expensedate } = req.body;

    if (!expensename || !expenseamount || !expensecategory || !expensedate) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
        const parsedExpenseAmount = parseFloat(expenseamount);
        const newExpense = new expenseModel({
            expensename,
            expenseamount: parsedExpenseAmount,
            expensecategory,
            expensedate
        });

        await newExpense.save();
        return res.status(201).json(newExpense);
    }
    catch (error) {
        console.error(error);
    }
}

const GetExpenses = async (req, res) => {
    try {
        const expenses = await expenseModel.find();
        return res.status(200).json(expenses);
    }
    catch (error) {
        console.error(error);
    }
}

const UpdateExpense = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure `id` is a valid ObjectId
        if (!id || id.length !== 24) {
            return res.status(400).json({ msg: "Invalid Expense ID" });
        }

        const updatedExpense = await expenseModel.findByIdAndUpdate(
            id, // Pass only the ID, not an object
            {
                expensename: req.body.expensename,
                expenseamount: req.body.expenseamount,
                expensecategory: req.body.expensecategory,
                expensedate: req.body.expensedate
            },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ msg: "Expense not found" });
        } else {
            return res.status(200).json({ msg: "Expense updated successfully", updatedExpense });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};


const DeleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        await expenseModel.findByIdAndDelete(id)
            .then(() => {
                res.status(200).json({ message: "Expense deleted successfully" });
            })
            .catch((error) => {
                res.status(500).json({ message: "Error deleting student", error });
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    const ExpenseTransaction = async (req, res) => {
        try {
          // Fetch only required fields including createdAt (which acts as date)
          const expenseTransaction = await expenseModel.find().select('expensename expenseamount createdAt'); 
          res.status(200).json(expenseTransaction);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };

      const ExpenseAmount = async (req, res) => {
        try {
          const result = await expenseModel.aggregate([
            {
              $group: {
                _id: null,
                totalExpense: { $sum: "$expenseamount" }, // More descriptive field name
              },
            },
          ]);
      
          const totalExpense = result.length > 0 ? result[0].totalExpense : 0; // Handle empty results
      
          res.status(200).json({ totalExpense });
        } catch (error) {
          console.error("Error fetching total expense:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      };
      

      

module.exports = { AddExpense, GetExpenses, UpdateExpense, DeleteExpense,ExpenseTransaction,ExpenseAmount };

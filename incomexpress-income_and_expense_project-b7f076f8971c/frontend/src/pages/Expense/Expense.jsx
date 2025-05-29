import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import axios from "axios";
import "../Expense/Expense.css";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const Expense = () => {
    const [expenses, setExpenses] = useState([]);
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [expenseDate, setExpenseDate] = useState("");
    const [editExpense, setEditExpense] = useState(null);
    const [categories, setCategories] = useState(["Food", "Transport", "Entertainment"]);
    const [search, setSearch] = useState("");
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get("http://localhost:3001/expense/getexpenses");
            setExpenses(response.data);

            // Extract unique categories from fetched expenses
            const uniqueCategories = [...new Set(response.data.map(exp => exp.expensecategory))];
            setCategories(prev => [...new Set([...prev, ...uniqueCategories])]);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const filteredExpenses = expenses.filter(expense =>
        expense.expensename.toLowerCase().includes(search.toLowerCase()));

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!expenseName || !expenseAmount || !expenseCategory || !expenseDate) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            if (editExpense) {
                await axios.put(`http://localhost:3001/expense/updateexpense/${editExpense._id}`, {
                    expensename: expenseName,
                    expenseamount: expenseAmount,
                    expensecategory: expenseCategory,
                    updatedAt: new Date(),  // Only update 'updatedAt'
                });
                //alert("Expense updated successfully");
                Swal.fire({
                    title: "Do you want to save the changes?",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    denyButtonText: "Don't Save",
                    cancelButtonText: "Cancel",
                    customClass: {
                        actions: "swal2-actions-custom",
                        confirmButton: "swal2-button-custom",
                        denyButton: "swal2-button-custom",
                        cancelButton: "swal2-button-custom"
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire("Changes are Saved!", "", "success");
                    } else if (result.isDenied) {
                        Swal.fire("Changes are not saved", "", "info");
                    }
                });
            } else {
                await axios.post("http://localhost:3001/expense/addexpense", {
                    expensename: expenseName,
                    expenseamount: expenseAmount,
                    expensecategory: expenseCategory,
                    expensedate: expenseDate, // Only for new expense
                    updatedAt: null, // No update date initially
                });
                //alert("Expense added successfully");
                Swal.fire({
                    title: "Expense data added successfully!",
                    position: "bottom-end",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 7000,
                    toast: true,
                    timerProgressBar: true,
                    background: "#155724",
                    color: "#d4edda",
                    customClass: {
                        popup: "rounded-lg p-4",
                        title: "font-bold text-lg",
                    },
                });
            }

            fetchExpenses();
            resetForm();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                html: "Something went wrong!",
            });
        }
    };

    const handleEditClick = (expense) => {
        setEditExpense(expense);
        setExpenseName(expense.expensename);
        setExpenseAmount(expense.expenseamount);
        setExpenseCategory(expense.expensecategory);
        setExpenseDate(expense.expensedate.split("T")[0]); // Keep displayed but disabled
    };

    const handleDeleteClick = async (id) => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you really want to delete this expense?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
          customClass: {
            actions: "swal2-actions-custom",
            confirmButton: "swal2-button-custom",
            cancelButton: "swal2-button-custom",
          },
        });
      
        if (result.isConfirmed) {
          try {
            await axios.delete(`http://localhost:3001/expense/deleteexpense/${id}`);
      
            Swal.fire({
              title: "Deleted!",
              text: "Expense has been deleted.",
              icon: "success",
              timer: 3000,
              showConfirmButton: false,
            });
      
            fetchExpenses(); // Refresh expenses list after deletion
          } catch (error) {
            console.error("Error deleting expense:", error);
            Swal.fire({
              title: "Error",
              text: "Failed to delete expense!",
              icon: "error",
            });
          }
        }
      };
      

    // Handle category input
    const handleCategoryInput = (e) => {
        const input = e.target.value;
        setExpenseCategory(input);

        // Check if the entered category already exists
        if (categories.includes(input)) {
            setShowNewCategoryInput(false);
        } else {
            setShowNewCategoryInput(true);
        }
    };

    // Add new category
    const handleAddCategory = () => {
        if (expenseCategory.trim() !== "" && !categories.includes(expenseCategory)) {
            setCategories([...categories, expenseCategory]);
            setShowNewCategoryInput(false);
        }
    };

    const resetForm = () => {
        setExpenseName("");
        setExpenseAmount("");
        setExpenseCategory("");
        setExpenseDate("");
        setEditExpense(null);
    };

    return (
        <div className="expense-cont">
            <h1 className="title">Expense Details</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search Expense"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <FaSearch className="search-icon" />
            </div>


            <form onSubmit={handleAddExpense} className="expenseform">


                <input
                    type="text"
                    placeholder="Expense Name"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}

                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                />

                {/* Category Input with Datalist */}
                <div className="category-input-container">
                    <input
                        type="text"
                        placeholder="Enter or Select Category"
                        value={expenseCategory}
                        onChange={handleCategoryInput}
                        list="category-options"
                    />
                    <datalist id="category-options">
                        {categories.map((cat, index) => (
                            <option key={index} value={cat} />
                        ))}
                    </datalist>

                    {showNewCategoryInput && expenseCategory && !categories.includes(expenseCategory) && (
                        <button type="button" onClick={handleAddCategory} className="add-category-btn">
                            <FaPlus /> Add
                        </button>
                    )}
                </div>

                {/* Created At - Disabled when editing */}
                <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    disabled={!!editExpense} // Disable when editing
                />

                <button type="submit">{editExpense ? "Update Expense" : "Add Expense"}</button>
                {editExpense && <button type="button" onClick={resetForm}>Cancel</button>}


            </form>

            <div className="expense-table-container">
                <table className="expense-table">
                    <thead>
                        <tr>
                            <th>Expense Name</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.length > 0 ? (
                            filteredExpenses.map((expense) => (
                                <tr key={expense._id}>
                                    <td>{expense.expensename}</td>
                                    <td>₹{parseFloat(expense.expenseamount).toFixed(2)}</td>
                                    <td>{expense.expensecategory}</td>
                                    <td>{new Date(expense.expensedate).toLocaleDateString()}</td>
                                    <td>
                                        {expense.updatedAt
                                            ? new Date(expense.updatedAt).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td>
                                        <FaEdit className="edit" onClick={() => handleEditClick(expense)} />
                                        <FaTrash className="delete" onClick={() => handleDeleteClick(expense._id)} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6">No expenses found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Expense;


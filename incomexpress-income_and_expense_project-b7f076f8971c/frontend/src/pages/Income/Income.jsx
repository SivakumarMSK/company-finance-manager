import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Income/Income.css";

function Income() {
    const [clientIncome, setClientIncome] = useState([]);
    const [studentIncome, setStudentIncome] = useState([]);
    const [totalClientIncome, setTotalClientIncome] = useState(0);
    const [totalStudentIncome, setTotalStudentIncome] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:3001/income/client-income") 
            .then((response) => {
                const clients = response.data;
                setClientIncome(clients);
                setTotalClientIncome(clients.reduce((sum, item) => sum + item.paidamount, 0));
            })
            .catch((error) => console.error("Error fetching client income:", error));

        axios.get("http://localhost:3001/income/student-income") 
            .then((response) => {
                const students = response.data;
                setStudentIncome(students);
                setTotalStudentIncome(students.reduce((sum, item) => sum + item.paidamount, 0));
            })
            .catch((error) => console.error("Error fetching student income:", error));
    }, []);

    const totalIncome = totalClientIncome + totalStudentIncome;

    return (
    <div className="income-page">
        {/* Income Summary Section (Single Row) */}
        <div className="income-summary">
            <div className="card total-income-card">
                <h2>Total Income</h2>
                <p>₹{totalIncome}</p>
            </div>
            <div className="card client-card">
                <h2 className="card-title">Total Client Income</h2>
                <p className="card-amount">₹{totalClientIncome}</p>
            </div>
            <div className="card student-card">
                <h2 className="card-title">Total Student Income</h2>
                <p className="card-amount">₹{totalStudentIncome}</p>
            </div>
        </div>

        {/* Page Title */}
        <h1 className="title">Income Overview</h1>

        <div className="income-container">
            {/* Client Income Section */}
            <div className="income-section">
                <h2 className="section-title">Client Income</h2>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount (₹)</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientIncome.map((income, index) => (
                                <tr key={index}>
                                    <td>{income.name}</td>
                                    <td>{income.paidamount}</td>
                                    <td>{new Date(income.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Income Section */}
            <div className="income-section">
                <h2 className="section-title">Student Income</h2>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount (₹)</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentIncome.map((income, index) => (
                                <tr key={index}>
                                    <td>{income.name}</td>
                                    <td>{income.paidamount}</td>
                                    <td>{new Date(income.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Income;

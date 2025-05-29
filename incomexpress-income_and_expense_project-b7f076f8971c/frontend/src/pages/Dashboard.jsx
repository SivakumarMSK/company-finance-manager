import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillWave, faChartPie, faUserGraduate, faUsers, faWallet } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "../pages/PageStyles/Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State variables
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [balance, setBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(new Array(12).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get("http://localhost:3001/student/studentincome");
        const clientResponse = await axios.get("http://localhost:3001/client/clientincome");
        const totalIncome = (studentResponse.data.totalPaid || 0) + (clientResponse.data.totalPaid || 0);
        setIncome(totalIncome);

        const expenseResponse = await axios.get("http://localhost:3001/expense/expenseAmount");
        const totalExpense = expenseResponse.data.totalExpense || 0;
        setExpense(totalExpense); 
        const balance = totalIncome - totalExpense;
        setBalance(balance);
        
        const studentCountResponse = await axios.get("http://localhost:3001/student/studentcount");
        setStudentCount(studentCountResponse.data.count || 0);

        const clientCountResponse = await axios.get("http://localhost:3001/client/clientcount");
        setClientCount(clientCountResponse.data.count || 0);

        // Update monthly income only for the current month
        const newMonthlyIncome = [...monthlyIncome];
        newMonthlyIncome[currentMonth] = getIncomeRangeIndex(totalIncome);
        setMonthlyIncome(newMonthlyIncome);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentMonth]); // Re-fetch data when the month changes

  // Fixed Y-axis income ranges
  const yLabels = ["0-5K", "5K - 10K", "10K - 25K", "25K - 50K", "50K - 75K", "75K - 1L", "1L - 5L", "5L - 1M"];
  const yValues = [5000, 10000, 25000, 50000, 75000, 100000, 500000, 1000000];

  // Function to find income range index
  const getIncomeRangeIndex = (amount) => {
    for (let i = 0; i < yValues.length; i++) {
      if (amount <= yValues[i]) return i + 1;
    }
    return yValues.length; // If income exceeds the last range
  };

  // Chart Data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Income ($)",
        data: monthlyIncome, // Using range index instead of raw income
        backgroundColor: [
          "#FF6384", // Color for January
          "#36A2EB", // Color for February
          "#FFCE56", // Color for March
          "#4BC0C0", // Color for April
          "#9966FF", // Color for May
          "#FF9F40", // Color for June
          "#FF6384", // Color for July
          "#36A2EB", // Color for August
          "#FFCE56", // Color for September
          "#4BC0C0", // Color for October
          "#9966FF", // Color for November
          "#FF9F40", // Color for December
        ],
      },
    ],
  };

  // Chart Options (Fixed Y-axis labels & custom tooltip)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Income: ${income.toLocaleString()}`;
          },
        },
        backgroundColor: "#333", // Dark background for the tooltip
        titleColor: "#fff", // White color for the tooltip title
        bodyColor: "#fff", // White color for the tooltip body
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff", // White color for x-axis labels
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: yLabels.length,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return yLabels[value - 1] || "";
          },
          color: "#fff", // White color for y-axis labels
        },
        title: {
          display: true,
          text: "Income Range",
          color: "#fff", // White color for y-axis title
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="title">Dashboard</h1>

      {/* Balance Card */}
      <div className="balance-card">
        <FontAwesomeIcon icon={faWallet} className="icon balance-icon" />
        <div>
          <h3>Balance</h3>
          <p>₹ {balance.toLocaleString()}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-container">
        <Card title={`₹ ${income.toLocaleString()}`} subtitle="Income" color="purple" icon={faMoneyBillWave} />
        <Card title={`₹ ${expense.toLocaleString()}`} subtitle="Expense" color="blue" icon={faChartPie} className="expense color" />
        <Card title={studentCount} subtitle="Student Visits" color="darkBlue" icon={faUserGraduate} onClick={() => navigate('/displaystudent')} />
        <Card title={clientCount} subtitle="Client Visits" color="red" icon={faUsers} onClick={() => navigate('/displayclient')} />
      </div>

      {/* Chart Section */}
      <div className="chart-container">
        <h3>Income Overview</h3>
        <div className="chart">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

// Card Component
const Card = ({ title, subtitle, color, icon, onClick }) => {
  return (
    <div className={`card ${color}`} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <FontAwesomeIcon icon={icon} className="icon" />
      <div className="card-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default Dashboard;
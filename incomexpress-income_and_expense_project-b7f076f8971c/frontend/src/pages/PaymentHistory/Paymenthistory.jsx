import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../PaymentHistory/Paymenthistory.css";

function Paymenthistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get("http://localhost:3001/student/studenttransaction");
        const clientResponse = await axios.get("http://localhost:3001/client/clienttransaction");
        const expenseResponse = await axios.get("http://localhost:3001/expense/expensetransaction");

        const incomeData = [...studentResponse.data, ...clientResponse.data].map(item => ({
          ...item,
          type: "income",
          amount: item.paidamount,
        }));

        const expenseData = expenseResponse.data.map(item => ({
          ...item,
          type: "expense",
          amount: -item.expenseamount,
        }));

        const combinedTransactions = [...incomeData, ...expenseData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTransactions(combinedTransactions);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const downloadPDF = () => {
    const input = document.getElementById("transaction-list");
  
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 297; // A4 page height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
  
      pdf.text("Payment History", 105, 10, { align: "center" });
  
      pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20; // Reduce height by used space
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }
  
      pdf.save("payment_history.pdf");
    });
  };
  
  return (
    <div className="payment-history" id="payment-history">
      <h2>Payment History</h2>
      <button onClick={downloadPDF} className="download-button">Download as PDF</button>
      {loading && <p>Loading transactions...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="transaction-container" id="transaction-container">
          <div className="transaction-list" id="transaction-list">
            {transactions.map((transaction) => (
              <div key={transaction._id} className={`transaction-card ${transaction.type}`}>
                <div className="transaction-info">
                  <span className="transaction-name">{transaction.name || transaction.expensename}</span>
                  <span className="transaction-date">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="transaction-amount">
                  {transaction.type === "income" ? "+₹" : "-₹"}{transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showScroll && (
        <button className="scroll-top-btn" onClick={scrollToTop}>⬆ Scroll Up</button>
      )}
    </div>
  );
}

export default Paymenthistory;

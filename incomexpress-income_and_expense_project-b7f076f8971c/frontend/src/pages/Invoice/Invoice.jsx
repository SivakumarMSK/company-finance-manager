import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Invoice.css";

function Invoice() {
  const [email, setEmail] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState("");
  

  const fetchInvoice = async () => {
    if (!email) {
      setError("Please enter an email.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/invoice/getinvoice/?email=${email}`);
      setInvoiceData(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching invoice:", error);
      setError("Invoice not found. Please check the email.");
      setInvoiceData(null);
    }
  };

 const generatePDF = () => {
  const input = document.getElementById("invoice-container");
  const printButton = document.querySelector(".print-button");

  if (printButton) printButton.style.display = "none"; // Hide before capture

  html2canvas(input, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    // === HEADER DESIGN (Curved Header) ===
    pdf.setFillColor(30, 40, 100); // Dark blue header
    pdf.ellipse(pageWidth / 2, 10, 120, 30, "F"); // Draw curved header
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    /* pdf.text("INVOICE", 15, 20); */

    pdf.setFontSize(24);
    pdf.text("ANJANA INFOTECH", 25, 20);

    // === Footer Design (Curved Footer) ===
    pdf.setFillColor(30, 40, 100); // Dark blue footer
    pdf.ellipse(pageWidth / 2, pageHeight - 5, 110, 25, "F"); // Footer curve
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.text("Thank you for your business!", 15, pageHeight - 10);

    // === Invoice Container (Rounded Rect Background) ===
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(10, 50, 190, 180, 5, 5, "FD"); // Main invoice box

    // === Overlay Invoice Data ===
    const imgWidth = 180;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 15, 55, imgWidth, imgHeight);

    const name = invoiceData?.name || "N/A";
    pdf.save(`${name !== "N/A" ? name : "invoice"}.pdf`);

    if (printButton) printButton.style.display = "block"; // Show again
  });
};

  

  return (
    <div className="invoice-page">
      {/* Email Input Section */}
      <h1 className='title'>Invoice</h1>
      <div className="invoice-input-container">
        <input
          type="email"
          placeholder="Enter email to fetch invoice"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="invoice-input"
        />
        <button onClick={fetchInvoice} className="invoice-fetch-button">
          Get Invoice
        </button>
      </div>

      {error && <p className="invoice-error">{error}</p>}

      {/* Invoice Display */}
      {invoiceData && (
        <div className="invoice-container" id="invoice-container">
          {/* Invoice Header */}
          <div className="invoice-header">
            <h2>Invoice</h2>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Invoice Details */}
          <div className="invoice-details">
            {/* Left Side (Name & College Name) */}
            <div className="invoice-info">
              <p><strong>Name:</strong> {invoiceData.name}</p>
              <p><strong>College/Company:</strong> {invoiceData.collegename || invoiceData.companyname}</p>
            </div>

            {/* Right Side (Status) */}
            <div className="status-container">
              Status
              <span className={invoiceData.remainingamount === 0 ? "paid" : "unpaid"}>
                {invoiceData.remainingamount === 0 ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>

          {/* Invoice Table */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Amount</td>
                <td>₹{invoiceData.totalamount}</td>
              </tr>
              <tr>
                <td>Paid Amount</td>
                <td>₹{invoiceData.paidamount}</td>
              </tr>
              <tr>
                <td>Remaining Amount</td>
                <td>₹{invoiceData.remainingamount}</td>
              </tr>
              <tr>
                <td>Joined Date</td>
                <td>{new Date(invoiceData.createdAt).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Print Button */}
          <button onClick={generatePDF} className="print-button">
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default Invoice;

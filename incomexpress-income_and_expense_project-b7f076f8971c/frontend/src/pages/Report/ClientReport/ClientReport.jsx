import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFilter, FaSync, FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../ClientReport/ClientReport.css";

function ClientReport() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [searchTerm, filter, startDate, endDate, clients]);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3001/client/displayclient");
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };

  const filterClients = () => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter((client) =>
        Object.values(client).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === "Paid" || filter === "Unpaid") {
      filtered = filtered.filter((client) =>
        filter === "Paid" ? client.remainingamount === 0 : client.remainingamount > 0
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((client) => {
        const clientDate = new Date(client.createdAt);
        return (
          clientDate >= new Date(startDate.setHours(0, 0, 0, 0)) &&
          clientDate <= new Date(endDate.setHours(23, 59, 59, 999))
        );
      });
    }

    // New filters for Today, Yesterday, This Week, This Month, This Year, All
    if (filter === "Today") {
      const today = new Date();
      filtered = filtered.filter((client) => {
        const clientDate = new Date(client.createdAt);
        return (
          clientDate.getDate() === today.getDate() &&
          clientDate.getMonth() === today.getMonth() &&
          clientDate.getFullYear() === today.getFullYear()
        );
      });
    }

    if (filter === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      filtered = filtered.filter((client) => {
        const clientDate = new Date(client.createdAt);
        return (
          clientDate.getDate() === yesterday.getDate() &&
          clientDate.getMonth() === yesterday.getMonth() &&
          clientDate.getFullYear() === yesterday.getFullYear()
        );
      });
    }

    if (filter === "This Week") {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      filtered = filtered.filter((client) => {
        const clientDate = new Date(client.createdAt);
        return clientDate >= startOfWeek && clientDate <= endOfWeek;
      });
    }

    if (filter === "This Month") {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      filtered = filtered.filter((client) => {
        const clientDate = new Date(client.createdAt);
        return clientDate >= startOfMonth && clientDate <= endOfMonth;
      });
    }

    if (filter === "This Year") {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      filtered = filtered.filter((client) => {
        const clientDate = new Date(client.createdAt);
        return clientDate >= startOfYear && clientDate <= endOfYear;
      });
    }

    if (filter === "All") {
      filtered = clients; // Reset to all clients
    }

    setFilteredClients(filtered);
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    setShowFilterMenu(false);
    filterClients();
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm("");
    setFilter("");
    fetchClients();
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    const input = document.getElementById("client-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("client_report.pdf");
      setIsGeneratingPDF(false);
    });
  };

  return (
    <div className="sturep-cont">
      <div className="sturep-top-bar">
        <div className="sturep-search-container">
          <input
            type="text"
            placeholder="Search clients..."
            className="sturep-search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="sturep-filter-container">
            <div className="filter-icon" onClick={() => setShowFilterMenu(!showFilterMenu)}>
              <FaFilter />
            </div>
            {showFilterMenu && (
              <div className="sturep-filter-menu">
                <button onClick={() => handleFilterChange("All")}>All</button>
                <button onClick={() => handleFilterChange("Paid")}>Paid</button>
                <button onClick={() => handleFilterChange("Unpaid")}>Unpaid</button>
                <button onClick={() => handleFilterChange("Today")}>Today</button>
                <button onClick={() => handleFilterChange("Yesterday")}>Yesterday</button>
                <button onClick={() => handleFilterChange("This Week")}>This Week</button>
                <button onClick={() => handleFilterChange("This Month")}>This Month</button>
                <button onClick={() => handleFilterChange("This Year")}>This Year</button>
                
              </div>
            )}
          </div>
        </div>

        <div className="sturep-date-picker-container">
          <div>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="clirep-date-picker"
          />
          </div>

         <div>
         <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="clirep-date-picker"
          />
         </div>

          <div className="sturep-refresh-button">
            <FaSync onClick={resetFilters} size={20} />
          </div>
        </div>

        <button className="sturep-download-button" onClick={generatePDF} disabled={isGeneratingPDF}>
          <FaDownload /> Download Report
        </button>
      </div>

      <h1 className="title">Client Report</h1>

      <div className="sturep-table-container">
        <table className="sturep-student-table" id="client-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Remaining Amount</th>
              <th>Company Name</th>
              
              
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client, index) => (
                <tr key={index}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.totalamount}</td>
                  <td>{client.paidamount}</td>
                  <td>{client.remainingamount}</td>
                  <td>{client.companyname}</td>
                  
                  
                  <td className={client.remainingamount === 0 ? "paid" : "unpaid"}>
                    {client.remainingamount === 0 ? "Paid" : "Unpaid"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="sturep-not-found">No clients found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientReport;
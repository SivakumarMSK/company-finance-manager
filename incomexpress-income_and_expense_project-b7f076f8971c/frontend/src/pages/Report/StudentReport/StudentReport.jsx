import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFilter, FaSync, FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../StudentReport/StudentReport.css";

function StudentReport() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, filter, startDate, endDate, students]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/student/displaystudent");
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const filterStudents = () => {
    let filtered = students;
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    if (searchTerm) {
      filtered = filtered.filter((student) =>
        Object.values(student).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === "Paid" || filter === "Unpaid") {
      filtered = filtered.filter((student) =>
        filter === "Paid" ? student.remainingamount === 0 : student.remainingamount > 0
      );
    } else if (filter === "Today") {
      filtered = filtered.filter((student) => {
        const studentDate = new Date(student.createdAt);
        return studentDate >= startOfToday;
      });
    } else if (filter === "Yesterday") {
      filtered = filtered.filter((student) => {
        const studentDate = new Date(student.createdAt);
        return studentDate >= startOfYesterday && studentDate < startOfToday;
      });
    } else if (filter === "This Week") {
      filtered = filtered.filter((student) => {
        const studentDate = new Date(student.createdAt);
        return studentDate >= startOfWeek;
      });
    } else if (filter === "This Month") {
      filtered = filtered.filter((student) => {
        const studentDate = new Date(student.createdAt);
        return studentDate >= startOfMonth;
      });
    } else if (filter === "This Year") {
      filtered = filtered.filter((student) => {
        const studentDate = new Date(student.createdAt);
        return studentDate >= startOfYear;
      });
    } else if (filter === "All") {
      // If "All" is selected, show all students without any filters.
      filtered = students;
    }

    if (startDate && endDate) {
      filtered = filtered.filter((student) => {
        const studentDate = new Date(student.createdAt);
        return studentDate >= new Date(startDate.setHours(0, 0, 0, 0)) &&
               studentDate <= new Date(endDate.setHours(23, 59, 59, 999));
      });
    }

    setFilteredStudents(filtered);
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    setShowFilterMenu(false);
    filterStudents();
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm("");
    setFilter("All"); // Reset to "All" filter to show all students.
    fetchStudents();
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    const input = document.getElementById("student-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("student_report.pdf");
      setIsGeneratingPDF(false);
    });
  };

  return (
    <div className="sturep-cont">
      <div className="sturep-top-bar">
        <div className="sturep-search-container">
          <input
            type="text"
            placeholder="Search students..."
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
                <button onClick={() => handleFilterChange("Paid")}>Paid</button>
                <button onClick={() => handleFilterChange("Unpaid")}>Unpaid</button>
                <button onClick={() => handleFilterChange("Today")}>Today</button>
                <button onClick={() => handleFilterChange("Yesterday")}>Yesterday</button>
                <button onClick={() => handleFilterChange("This Week")}>This Week</button>
                <button onClick={() => handleFilterChange("This Month")}>This Month</button>
                <button onClick={() => handleFilterChange("This Year")}>This Year</button>
                <button onClick={() => handleFilterChange("All")}>All</button> {/* New 'All' button */}
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
            className="sturep-date-picker"
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
            className="sturep-date-picker"
          />

          </div>
          <button className="sturep-refresh-button" onClick={resetFilters}>
            <FaSync />
          </button>
        </div>

        <button className="sturep-download-button" onClick={generatePDF} disabled={isGeneratingPDF}>
          <FaDownload /> Download Report
        </button>
      </div>

      <h1 className="title">Student Report</h1>

      <div className="sturep-table-container">
        <table className="sturep-student-table" id="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Remaining Amount</th>
              <th>College Name</th>
              <th>Domain</th>
              <th>Project Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.totalamount}</td>
                  <td>{student.paidamount}</td>
                  <td>{student.remainingamount}</td>
                  <td>{student.collegename}</td>
                  <td>{student.domain}</td>
                  <td>{student.projecttitle}</td>
                  <td className={student.remainingamount === 0 ? "paid" : "unpaid"}>
                    {student.remainingamount === 0 ? "Paid" : "Unpaid"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="sturep-not-found">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentReport;

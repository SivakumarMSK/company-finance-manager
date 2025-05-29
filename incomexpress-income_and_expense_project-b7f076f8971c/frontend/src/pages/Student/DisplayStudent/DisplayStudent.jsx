import React, { useState, useEffect } from "react";
import axios from "axios";
import "../DisplayStudent/DisplayStudent.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function DisplayStudent() {
  const [students, setStudents] = useState([]); // State to store student data
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered student list
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [editStudent, setEditStudent] = useState(null); // State to manage the selected student for editing
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    fetchStudents(); // Fetch the student list when the component mounts
    handleFileUpload();
  }, []);

  // Fetch students from the backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/student/displaystudent");
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(value) ||
        student.email.toLowerCase().includes(value) ||
        student.collegename.toLowerCase().includes(value) ||
        student.domain.toLowerCase().includes(value) ||
        student.projecttitle.toLowerCase().includes(value)
    );
    setFilteredStudents(filtered);
  };

  // Handle Edit button click
  const handleEditClick = (student) => {
    setEditStudent(student); // Set student data to edit form
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If user changes paidAmount, recalculate remainingAmount
    if (name === "paidamount") {
      const remaining = editStudent.totalamount - value;
      setEditStudent({ ...editStudent, [name]: value, remainingamount: remaining });
    } else {
      setEditStudent({ ...editStudent, [name]: value });
    }
  };



  // Handle form submission
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      console.log(editStudent._id);
      console.log(editStudent);
      const response = await axios.put(`http://localhost:3001/student/updatestudent/${editStudent._id}`, editStudent);

      if (response.status === 200 && response.data.message === "Student details updated successfully") {
        //alert("Student updated successfully!");
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

        navigate("/displaystudent");
      }

      fetchStudents(); // Refresh student list
      setEditStudent(null); // Close modal after update
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Handle file import
  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();

  //   reader.onload = async (event) => {
  //     const arrayBuffer = event.target.result;
  //     const data = new Uint8Array(arrayBuffer);
  //     const workbook = XLSX.read(data, { type: "array" }); // Use 'array' type instead of 'binary'

  //     const sheetName = workbook.SheetNames[0]; // Get first sheet
  //     const sheet = workbook.Sheets[sheetName];
  //     const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert to JSON

  //     console.log("Excel Data:", jsonData);

  //     try {
  //       const response = await axios.post(
  //         "http://localhost:3001/student/importstudents",
  //         jsonData
  //       );
  //       if (response.status === 200) {
  //         //alert("Students imported successfully!");
  //         Swal.fire({
  //           title: "Students data added successfully!",
  //           position: "bottom-end",
  //           icon: "success",
  //           showConfirmButton: false,
  //           timer: 7000,
  //           toast: true,
  //           timerProgressBar: true,
  //           background: "#155724",
  //           color: "#d4edda",
  //           customClass: {
  //             popup: "rounded-lg p-4",
  //             title: "font-bold text-lg",
  //           }
  //         });
  //         fetchStudents(); // Refresh student list
  //       }
  //     } catch (error) {
  //       console.error("Error importing students:", error);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops...",
  //         html: "Something went wrong!<br><br><p>Students data already exists!</p>",
  //       });
  //     }
  //   };

  //   reader.readAsArrayBuffer(file); // Use 'readAsArrayBuffer' instead of 'readAsBinaryString'
  //   window.location.reload();
  // };
  const handleFileUpload = async (e) => {
    if (!e?.target?.files?.length) {
      console.error("No file selected or event is undefined.");
      return;
    }
  
    const file = e.target.files[0]; // Ensure file is selected
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      if (!arrayBuffer) {
        console.error("Failed to read file.");
        return;
      }
  
      try {
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
  
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
  
        console.log("Excel Data:", jsonData);
  
        const response = await axios.post(
          "http://localhost:3001/student/importstudents",
          jsonData
        );
  
        if (response.status === 200) {
          Swal.fire({
            title: "Students data added successfully!",
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
  
          fetchStudents(); // Refresh student list
        }
      } catch (error) {
        console.error("Error importing students:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          html: "Something went wrong!<br><br><p>Students data already exists!</p>",
        });
      }
    };
  
    reader.readAsArrayBuffer(file);
  };
  


  // Handle Delete button click
  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this student?",
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
        await axios.delete(`http://localhost:3001/student/deletestudent/${id}`);
  
        Swal.fire({
          title: "Deleted!",
          text: "Student has been deleted.",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
  
        fetchStudents(); // Refresh student list after deletion
      } catch (error) {
        console.error("Error deleting student:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete student!",
          icon: "error",
        });
      }
    }
  };
  
  


  return (
    <div className="student-container">
      <div className='student-head'>
        <ul>
          <li><h1 className="title">Display Student List</h1></li>
          <li><button onClick={() => navigate("/student")} className="add-student">Add Student</button></li>
        </ul>
      </div>

      <div className="top-bar">
        <ul>
          <li>
            <input
              type="text"
              placeholder="Search students..."
              className="search-box"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </li>
          <li>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="import-button" />
          </li>
        </ul>
      </div>

      <div className="student-table-wrapper">
        <table className="student-table">
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
              <th>Action</th>
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
                  <td className="action">
                    <FaEdit className="edit" onClick={() => handleEditClick(student)} />
                    <FaTrash className="delete" onClick={() => handleDeleteClick(student._id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="not-found">No Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Form Modal */}
      {editStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleUpdateStudent} className="edit-stu">
              <div className="row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editStudent.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter student name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editStudent.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter student email"
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Total Amount</label>
                  <input
                    type="number"
                    name="totalamount"
                    value={editStudent.totalamount}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter total amount"
                  />
                </div>
                <div className="form-group">
                  <label>Paid Amount</label>
                  <input
                    type="number"
                    name="paidamount"
                    value={editStudent.paidamount}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter paid amount"
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Remaining Amount</label>
                  <input
                    type="number"
                    name="remainingamount"
                    value={editStudent.remainingamount}
                    className="form-control"
                    readOnly
                    placeholder="Remaining amount will be calculated"
                  />
                </div>
                <div className="form-group">
                  <label>College Name</label>
                  <input
                    type="text"
                    name="collegename"
                    value={editStudent.collegename}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter college name"
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Domain</label>
                  <input
                    type="text"
                    name="domain"
                    value={editStudent.domain}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter domain"
                  />
                </div>
                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    name="projecttitle"
                    value={editStudent.projecttitle}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter project title"
                  />
                </div>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="save-button">Save Changes</button>
                <button type="button" className="cancel-button" onClick={() => setEditStudent(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>

  );
}

export default DisplayStudent; 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../AddStudent/StudentDetail.css"; // Import the CSS file
import Swal from "sweetalert2";

function StudentDetail() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    totalAmount: "",
    paidAmount: "",
    remainingAmount: "",
    collegeName: "",
    domain: "",
    projectTitle: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.totalAmount) {
      newErrors.totalAmount = "Total amount is required";
    } else if (parseFloat(formData.totalAmount) < 0) {
      newErrors.totalAmount = "Total amount cannot be negative";
    }
    if (!formData.paidAmount) {
      newErrors.paidAmount = "Paid amount is required";
    } else if (parseFloat(formData.paidAmount) < 0) {
      newErrors.paidAmount = "Paid amount cannot be negative";
    } else if (parseFloat(formData.paidAmount) > parseFloat(formData.totalAmount)) {
      newErrors.paidAmount = "Paid amount cannot exceed total amount";
    }
    if (formData.remainingAmount === undefined) {
      newErrors.remainingAmount = "Remaining amount is required";
    }
    if (!formData.collegeName.trim()) newErrors.collegeName = "College name is required";
    if (!formData.domain.trim()) newErrors.domain = "Domain is required";
    if (!formData.projectTitle.trim()) newErrors.projectTitle = "Project title is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "totalAmount" || name === "paidAmount") {
      const total = name === "totalAmount" ? parseFloat(value) || 0 : parseFloat(formData.totalAmount) || 0;
      const paid = name === "paidAmount" ? parseFloat(value) || 0 : parseFloat(formData.paidAmount) || 0;
      setFormData((prev) => ({
        ...prev,
        remainingAmount: total - paid >= 0 ? total - paid : 0,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post("http://localhost:3001/student/addstudent", formData);
      if (response.status === 201) {
        // alert("Successfully submitted");
        Swal.fire({
          title: "Student added successfully!",
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
          }
      });                 
        navigate("/displaystudent");
      }
    } catch (error) {
      //alert("Error submitting form");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: "Something went wrong!<br><p>Student already exists!</p>", // Use 'html' instead of 'text'
    });
        
    }
  };

  return (
    <div className="add-stu-container">
      
      <form onSubmit={handleFormSubmit} className="add-stu-form">
      <h1 className='stu-head'>Add Student Form</h1>
        <div className="add-stu-form-grid">
          <div>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter student name" />
            {errors.name && <span>{errors.name}</span>}
          </div>

          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter student email" />
            {errors.email && <span>{errors.email}</span>}
          </div>

          <div>
            <label>Total Amount</label>
            <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} placeholder="Enter total amount" />
            {errors.totalAmount && <span>{errors.totalAmount}</span>}
          </div>

          <div>
            <label>Paid Amount</label>
            <input type="number" name="paidAmount" value={formData.paidAmount} onChange={handleInputChange} placeholder="Enter paid amount" />
            {errors.paidAmount && <span>{errors.paidAmount}</span>}
          </div>

          <div>
            <label>Remaining Amount</label>
            <input type="number" name="remainingAmount" value={formData.remainingAmount} readOnly placeholder="Remaining amount will be calculated" />
            {errors.remainingAmount && <span>{errors.remainingAmount}</span>}
          </div>

          <div>
            <label>College Name</label>
            <input type="text" name="collegeName" value={formData.collegeName} onChange={handleInputChange} placeholder="Enter college name" />
            {errors.collegeName && <span>{errors.collegeName}</span>}
          </div>

          <div>
            <label>Domain</label>
            <input type="text" name="domain" value={formData.domain} onChange={handleInputChange} placeholder="Enter domain" />
            {errors.domain && <span>{errors.domain}</span>}
          </div>

          <div>
            <label>Project Title</label>
            <input type="text" name="projectTitle" value={formData.projectTitle} onChange={handleInputChange} placeholder="Enter project title" />
            {errors.projectTitle && <span>{errors.projectTitle}</span>}
          </div>
          
        </div>
        <button  type='submit'  className="add-stu-submit">Submit</button>
        
      </form>
    </div>
  );
}

export default StudentDetail;

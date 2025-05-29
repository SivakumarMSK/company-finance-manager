import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../AddClient/ClientDetail.css'
import Swal from "sweetalert2";

function ClientDetail() {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    totalAmount: "",
    paidAmount: "",
    remainingAmount: "",
    companyName: "",
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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.totalAmount) {
      newErrors.totalAmount = "Total amount is required";
    } else if (parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = "Total amount must be greater than zero";
    }
    if (!formData.paidAmount) {
      newErrors.paidAmount = "Paid amount is required";
    } else if (parseFloat(formData.paidAmount) < 0) {
      newErrors.paidAmount = "Paid amount cannot be negative";
    } else if (parseFloat(formData.paidAmount) > parseFloat(formData.totalAmount)) {
      newErrors.paidAmount = "Paid amount cannot exceed total amount";
    }
    if (!formData.companyName.trim()) newErrors.companyName = "Company Name is required";
    if (!formData.domain.trim()) newErrors.domain = "Domain is required";
    if (!formData.projectTitle.trim()) newErrors.projectTitle = "Project Title is required";

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
      const response = await axios.post("http://localhost:3001/client/addclient", formData);
      if (response.status === 201) {
        // alert("Successfully submitted");
               Swal.fire({
                       title: "Client added successfully!",
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
        navigate("/displayclient");
      }
    } catch (error) {
      //alert("Submission failed. Please try again.");
        Swal.fire({
              icon: "error",
              title: "Oops...",
              html: "Something went wrong!<br><br><p>Client already exists!</p>", // Use 'html' instead of 'text'
          });
    }
    setClients([...clients, formData]);
    setFormData({
      name: "",
      email: "",
      totalAmount: "",
      paidAmount: "",
      remainingAmount: "",
      companyName: "",
      domain: "",
      projectTitle: "",
    });
  };

  return (
    <div className="add-cli-container">
      
      <form onSubmit={handleFormSubmit} className="add-cli-form">
      <h1 className='cli-head'>Add Client Form</h1>
        <div className="add-cli-form-grid">
          <div>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter client name" />
            {errors.name && <span>{errors.name}</span>}
          </div>

          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter client email" />
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
          </div>

          <div>
            <label>Company Name</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Enter company name" />
            {errors.companyName && <span>{errors.companyName}</span>}
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
        <button type='submit' className="add-cli-submit">Submit</button>
      </form>
    </div>
  );
}

export default ClientDetail;

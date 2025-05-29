import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../DisplayClient/DisplayClient.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";


function DisplayClient() {
  const navigate = useNavigate();
  const [ClientData, setClientData] = useState([]); // Original client data
  const [filteredData, setFilteredData] = useState([]); // Filtered client data for display
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editClient, setEditClient] = useState(null); // State for managing the client to edit

  useEffect(() => {
    fetchClients(); // Fetch the client list when the component mounts
  }, []);

  // Fetch clients from the backend
  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3001/client/displayclient");
      setClientData(response.data);
      setFilteredData(response.data); // Initialize filtered data with full data
    } catch (error) {
      console.error("Error fetching client details:", error);
      setError("Failed to fetch client data..."); // Ensure `setError` is properly defined
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  useEffect(() => {
    const filtered = ClientData.filter((client) =>
      Object.values(client)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, ClientData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Handle Edit button click
  const handleEditClick = (client) => {
    setEditClient(client); // Set client data to edit form
  };

  // Handle Delete button click
  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this client?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        actions: "swal2-actions-custom",
        confirmButton: "swal2-button-custom",
        denyButton: "swal2-button-custom",
        cancelButton: "swal2-button-custom"
      }
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/client/deleteclient/${id}`);
  
        Swal.fire({
          title: "Deleted!",
          text: "Client has been deleted.",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
  
        fetchClients(); // Refresh client list after deletion
      } catch (error) {
        console.error("Error deleting client:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete client!",
          icon: "error",
        });
      }
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If user changes paidAmount, recalculate remainingAmount
    if (name === "paidamount") {
      const remaining = editClient.totalamount - value;
      setEditClient({ ...editClient, [name]: value, remainingamount: remaining });
    } else {
      setEditClient({ ...editClient, [name]: value });
    }
  };

  // Handle form submission for updating client
  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3001/client/updateclient/${editClient._id}`, {
        name: editClient.name,
        email: editClient.email,
        totalamount: editClient.totalamount,
        paidamount: editClient.paidamount,
        remainingamount: editClient.remainingamount, // ✅ Now sending remaining amount
        companyname: editClient.companyname,
        domain: editClient.domain,
        projecttitle: editClient.projecttitle
      });

      if (response.status === 200 && response.data.message === "Client details updated successfully") {
        // alert("Client updated successfully!");
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

        fetchClients(); // Refresh client list
        setEditClient(null); // Close modal
      }
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" }); // Use 'array' type instead of 'binary'

      const sheetName = workbook.SheetNames[0]; // Get first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert to JSON

      console.log("Excel Data:", jsonData);

      try {
        const response = await axios.post(
          "http://localhost:3001/client/importclients",
          jsonData
        );
        if (response.status === 200) {
          //alert("Clients imported successfully!");
          Swal.fire({
            title: "Clients data added successfully!",
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
          fetchClients(); // Refresh client list
        }
      } catch (error) {
        console.error("Error importing Clients:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          html: "Something went wrong!<br><br><p>Clients data already exists!</p>", // Use 'html' instead of 'text'
        });
      }
    };

    reader.readAsArrayBuffer(file); // Use 'readAsArrayBuffer' instead of 'readAsBinaryString'
  };


  return (
    <div className="client-container">
      <div className="client-head">
        <ul>
          <li><h1 className="title">Display Client List</h1></li>
          <li><button onClick={() => navigate("/client")} className="add-client">
            Add Client
          </button></li>
        </ul>
      </div>

      <div className="top-bar">
        <ul>
          <li>
            <input
              type="text"
              placeholder="Search clients..."
              className="search-box"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </li>
          <li>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="import-button" />
          </li>
        </ul>
      </div>

      <div className="client-table-wrapper">
        <table className="client-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Remaining Amount</th>
              <th>Company Name</th>
              <th>Domain</th>
              <th>Project Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredData.length > 0 ? (
                filteredData.map((client, index) => (
                  <tr key={index}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.totalamount}</td>
                    <td>{client.paidamount}</td>
                    <td>{client.remainingamount}</td>
                    <td>{client.companyname}</td>
                    <td>{client.domain}</td>
                    <td>{client.projecttitle}</td>
                    <td className="action">
                      <FaEdit className="edit" onClick={() => handleEditClick(client)} />
                      <FaTrash className="delete" onClick={() => handleDeleteClick(client._id)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="not-found">No clients found matching "{searchQuery}"</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>

      {/* Edit Form Modal */}
      {editClient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleUpdateClient} className="edit-client">
              <div className="row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editClient.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter client name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editClient.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter client email"
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Total Amount</label>
                  <input
                    type="number"
                    name="totalamount"
                    value={editClient.totalamount}
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
                    value={editClient.paidamount}
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
                    value={editClient.remainingamount}
                    className="form-control"
                    readOnly
                    placeholder="Remaining amount will be calculated"
                  />
                </div>
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="companyname"
                    value={editClient.companyname}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Domain</label>
                  <input
                    type="text"
                    name="domain"
                    value={editClient.domain}
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
                    value={editClient.projecttitle}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter project title"
                  />
                </div>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="save-button">Save Changes</button>
                <button type="button" className="cancel-button" onClick={() => setEditClient(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayClient;


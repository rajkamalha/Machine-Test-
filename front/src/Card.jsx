import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import "./Card.css";

function Card() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    salary: "",
    image: null,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees");
      setEmployees(response.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      if (editingEmployee) {
        await axios.put(`http://localhost:5000/employees/${editingEmployee}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:5000/employees", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchEmployees();
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      designation: "",
      dateOfJoining: "",
      salary: "",
      image: null,
    });
    setEditingEmployee(null);
    setViewEmployee(null);
  };

  const getInitials = (firstName, lastName) => {
    return (firstName[0]?.toUpperCase() + lastName[0]?.toUpperCase()) || "N/A";
  };


  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Employees</h3>
        <button
          className="btn btn-dark bg-white rounded-circle" 
          onClick={() => setShowModal(true)}
        >
          <i className=" bi bi-plus text-dark bg-white fs-3" ></i>
        </button>
      </div>

      <div className="row">
        {employees.map((employee) => (
          <div className="col-md-4 mb-4" key={employee._id}>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <p className="card-text rounded-pill ms-auto">{employee._id}</p>
                </div>

                <div className="text-center mb-3">
                  {employee.image ? (
                    <img
                      src={`data:image/jpeg;base64,${employee.image}`}
                      alt="Employee"
                      className="rounded-circle border border-primary mt-1"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="placeholder-circle mt-1">
                      {getInitials(employee.firstName, employee.lastName)}
                    </div>
                  )}
                </div>
                <h5 className="card-title text-center fw-bold">
                  {employee.firstName} {employee.lastName}
                </h5>
                <p className="mb-1 text-center text-muted fw-bold">
                  {employee.email}
                </p>

                <div className="d-flex justify-content-between align-items-center text-muted mb-3">
                  <i
                    className="bi bi-pencil fs-3"
                    onClick={() => {
                      setEditingEmployee(employee._id);
                      setFormData({
                        firstName: employee.firstName,
                        lastName: employee.lastName,
                        email: employee.email,
                        department: employee.department,
                        designation: employee.designation,
                        dateOfJoining: new Date(employee.dateOfJoining)
                          .toISOString()
                          .split("T")[0],
                        salary: employee.salary,
                        image: null,
                      });
                      setShowModal(true);
                    }}
                  ></i>
                  <i
                    className="bi bi-eye fs-3"
                    onClick={() => setViewEmployee(employee)}
                  ></i>
                  <i
                    onClick={() => handleDelete(employee._id)}
                    className="bi bi-trash fs-3"
                  ></i>
                </div>

                <hr />
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="mb-1 text-center fw-bold">
                      {employee.department} <br />
                      <span className="text-muted fw-bold">Department</span>
                    </p>
                    <p className="mb-1 text-center fw-bold">
                      {new Date(employee.dateOfJoining).toLocaleDateString()} <br />
                      <span className="text-muted fw-bold">Date of Joining</span>
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1 fw-bold">
                      {employee.designation} <br />
                      <span className="text-muted fw-bold">Designation</span>
                    </p>
                    <p className="mb-1 fw-bold">
                      {employee.salary}
                      <br />
                      <span className="text-muted fw-bold">Salary</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content bg-white rounded border" style={{ width: "600px" }}>
            <h3>{editingEmployee ? "Edit Employee" : "Create New Employee"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  className="form-control"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="designation">Designation</label>
                <input
                  type="text"
                  className="form-control"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateOfJoining">Date of Joining</label>
                <input
                  type="date"
                  className="form-control"
                  id="dateOfJoining"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="number"
                  className="form-control"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  name="image"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmployee ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewEmployee && (
        <div className="modal-overlay">
          <div className="modal-content bg-white rounded border" style={{ width: "400px" }}>
            <div className="text-center">
              {viewEmployee.image ? (
                <img
                  src={`data:image/jpeg;base64,${viewEmployee.image}`}
                  alt="Employee"
                  className="rounded-circle border border-primary mt-3"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
              ) : (
                <div className="placeholder-circle mt-3">
                  {getInitials(viewEmployee.firstName, viewEmployee.lastName)}
                </div>
              )}
              <h4 className="mt-3">{viewEmployee.firstName} {viewEmployee.lastName}</h4>
              <p className="text-muted">{viewEmployee.email}</p>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;

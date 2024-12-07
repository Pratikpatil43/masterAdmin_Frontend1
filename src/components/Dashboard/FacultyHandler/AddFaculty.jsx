import React, { useState } from "react";
import axios from "axios";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Spinner } from "react-bootstrap"; // Import Spinner component

const AddFaculty = () => {
  const [formData, setFormData] = useState({
    name: "",
    facultyUsername: "",
    password: "",
    branch: "",
    subject: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submission starts

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      // Send data to backend API with the headers and the form data in the body
      const response = await axios.post(
        "https://attendancetracker-backend1.onrender.com/api/masterAdmin/faculty/add", // Correct route
        formData, // Pass form data here
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token for authentication
          },
        }
      );

      setMessage(response.data.message);  // Success message
      setError(null);  // Clear previous error messages
      setFormData({ name: "", facultyUsername: "", password: "", branch: "", subject: "" });  // Reset form
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add faculty");
      setMessage(null);  // Clear success message
    } finally {
      setLoading(false); // Set loading to false when submission finishes
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-5">
          <div className="card shadow-sm border-light">
            <div className="card-header text-center" style={{ backgroundColor: '#f8f9fa' }}>
              <h4 className="text-muted">Add Faculty</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Enter Faculty's Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="facultyUsername" className="form-label">Username</label>
                  <input
                    type="email"
                    id="facultyUsername"
                    name="facultyUsername"
                    className="form-control"
                    placeholder="Enter Username"
                    value={formData.facultyUsername}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="position-absolute"
                    style={{
                      top: "65%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {passwordVisible ? <BsEyeSlash /> : <BsEye />}
                  </span>
                </div>

                <div className="mb-3">
                  <label htmlFor="branch" className="form-label">Branch</label>
                  <input
                    type="text"
                    id="branch"
                    name="branch"
                    className="form-control"
                    placeholder="Enter Branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="form-control"
                    placeholder="Enter Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        Adding...
                      </>
                    ) : (
                      "Add Faculty"
                    )}
                  </button>
                </div>
              </form>

              {/* Display success or error messages */}
              {message && (
                <div className="alert alert-success mt-3" role="alert">
                  {message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFaculty;

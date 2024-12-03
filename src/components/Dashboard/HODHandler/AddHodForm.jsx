import React, { useState } from "react";
import { addHod } from "../../../services/hodService"; // Import the addHod service
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Spinner } from "react-bootstrap"; // Import Spinner from react-bootstrap

const AddHodForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "hod",
    username: "",
    password: "",
    branch: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    try {
      const data = await addHod(formData);
      setMessage(data?.message || "HOD added successfully!");
      setError(null);
      setFormData({
        name: "",
        role: "hod",
        username: "",
        password: "",
        branch: "",
      });
    } catch (err) {
      setError(err.message || "An error occurred while adding the HOD.");
      setMessage(null);
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-5">
          <div className="card shadow-sm border-light">
            <div className="card-header text-center bg-light">
              <h4 className="text-muted">Add New HOD</h4>
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
                    placeholder="Enter HOD's Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="email"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type={passwordVisible ? "text" : "password"}
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
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <Spinner animation="border" size="sm" /> // Display spinner when loading
                    ) : (
                      "Add HOD"
                    )}
                  </button>
                </div>
              </form>
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

export default AddHodForm;

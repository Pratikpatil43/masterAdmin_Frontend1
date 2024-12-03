import React, { useState, useEffect } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

const FetchFaculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [formData, setFormData] = useState({ name: "", username: "", branch: "", subject: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  // Fetch Faculties
  const fetchFaculties = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const decodedToken = decodeJWT(token);
      if (!decodedToken || !decodedToken.masterAdmin) {
        throw new Error("Invalid token: masterAdminId missing.");
      }
      const response = await axios.get(`http://localhost:5000/api/masterAdmin/faculty/getFaculty/${decodedToken.masterAdmin}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaculties(response.data.facultyMembers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Deletion of Faculty
  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const decodedToken = decodeJWT(token);
      if (!decodedToken || !decodedToken.masterAdmin) {
        throw new Error("Invalid token: masterAdminId missing.");
      }

      await axios.delete(`http://localhost:5000/api/masterAdmin/faculty/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted faculty from the list
      setFaculties(faculties.filter((faculty) => faculty._id !== id));
    } catch (err) {
      setError("Failed to delete faculty: " + err.message);
    }
  };

  // Handle Update (open the modal with existing data)
  const handleUpdate = (faculty) => {
    // Log the faculty object to ensure it has the correct _id
    console.log("Selected Faculty:", faculty);
  
    setCurrentFaculty(faculty);  // This sets the currentFaculty object including _id
    setFormData({
      name: faculty.name,
      username: faculty.username,
      branch: faculty.branch,
      subject: faculty.subject,
    });
    setShowUpdateModal(true); // Show the modal
  };
  

  // Close the modal
  const handleModalClose = () => {
    setShowUpdateModal(false);
    setCurrentFaculty(null);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit updated data to the server
  const handleUpdateSubmit = async () => {
    if (!currentFaculty || !currentFaculty._id) {
      console.error("Faculty ID is missing or undefined!");
      return; // Prevent further processing
    }
  
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      // Decode the JWT token using the custom decodeJWT function
      const decodedToken = decodeJWT(token);
      if (!decodedToken || !decodedToken.masterAdmin) {
        throw new Error("Invalid token: masterAdminId missing.");
      }
  
      const updatedData = { ...formData };
      // If password is empty, we don't include it in the update request
      if (!updatedData.password) {
        delete updatedData.password;
      }
  
      console.log("Updating faculty with ID:", currentFaculty._id);  // Log the ID for debugging
  
      // Update Faculty using the id and token for authentication
      const response = await axios.put(
        `http://localhost:5000/api/masterAdmin/faculty/update/${currentFaculty._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update the Faculty list with the updated Faculty
      setFaculties((prevFaculties) =>
        prevFaculties.map((faculty) =>
          faculty._id === currentFaculty._id ? { ...faculty, ...updatedData } : faculty
        )
      );
      setShowUpdateModal(false); // Close the modal after the update
      setCurrentFaculty(null);
    } catch (err) {
      setError("Failed to update Faculty: " + err.message);
    }
  };
  
  useEffect(() => {
    fetchFaculties();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center">Faculty Management</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Faculty Table */}
      <table className="table table-hover mt-3">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Branch</th>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map((faculty) => (
            <tr key={faculty._id}>
              <td>{faculty.name}</td>
              <td>{faculty.username}</td>
              <td>{faculty.branch}</td>
              <td>{faculty.subject}</td>
              <td>
                <Button variant="warning" onClick={() => handleUpdate(faculty)} className="me-2">
                  <BsPencil />
                </Button>
                <Button variant="danger" onClick={() => handleDelete(faculty._id)}>
                  <BsTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Branch</Form.Label>
              <Form.Control
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FetchFaculty;

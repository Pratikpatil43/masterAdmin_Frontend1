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

      // Decode the JWT token using the custom decodeJWT function
      const decodedToken = decodeJWT(token);
      console.log("Decoded Token:", decodedToken); // Log the decoded token
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

  // Handle Delete
  const handleDelete = async (id) => {
    if (!id) {
      console.error('ID is undefined or invalid');
      return;
    }
  
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");
  
      console.log(`Deleting faculty with ID: ${id}`);
      await axios.delete(`http://localhost:5000/api/masterAdmin/faculty/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update the UI by removing the deleted faculty
      setHods((prevHods) => prevHods.filter((hod) => hod._id !== id));
    } catch (err) {
      console.error('Error deleting faculty:', err);
    }
  };

  
  
  // Handle Update Button Click
const handleUpdateClick = (faculty) => {
  setCurrentFaculty(faculty); // Set the current faculty to be updated
  setFormData({
    name: faculty.name,
    facultyUsername: faculty.username, // Make sure this matches backend field
    branch: faculty.branch,
    subject: faculty.subject,
  });
  
  setShowUpdateModal(true); // Show the update modal
};

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name,facultyUsername, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Submit Update
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
  
    if (!currentFaculty || !currentFaculty._id) {
      alert("Faculty ID is missing!");
      return;
    }
  
    try {
      const token = sessionStorage.getItem("token");
  
      // Use the currentFaculty's ID, and pass updated fields from formData
      const updatedFaculty = { ...currentFaculty, ...formData };
  
      const response = await axios.put(
        `http://localhost:5000/api/masterAdmin/faculty/update/${currentFaculty._id}`,
        updatedFaculty,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert(response.data.message);
      setShowUpdateModal(false); // Close modal after update
      fetchFaculties(); // Refresh faculty list after update
    } catch (error) {
      console.error("Error updating faculty:", error);
      alert("Failed to update faculty.");
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
                <Button variant="warning" onClick={() => handleUpdateClick(faculty)} className="me-2">
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
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.facultyUsername}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Branch</Form.Label>
              <Form.Control
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
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

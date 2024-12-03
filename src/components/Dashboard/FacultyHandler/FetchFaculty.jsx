import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { BsPencil, BsTrash } from "react-icons/bs";

// Manually decode JWT
const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

const FetchFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    facultyUsername: '', // Make sure this matches your field
    branch: '',
    subject: ''
  });

  // Fetch faculties
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
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(response.data.facultyMembers); // Log response to verify data
      setFaculty(response.data.facultyMembers);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to fetch faculty');
    }
  };

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
  
      // Send the delete request
      const response = await axios.delete(`http://localhost:5000/api/masterAdmin/faculty/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setMessage(response.data.message);
  
      // Remove the faculty from the state to reflect the UI changes immediately
      setFaculty(faculty.filter((facultyItem) => facultyItem.id !== id));
  
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete faculty');
    }
  };
  
  const handleUpdate = (faculty) => {
    setSelectedFaculty(faculty);
    setFormData({
      name: faculty.name,
      facultyUsername: faculty.username, // Ensure the correct field here
      branch: faculty.branch,
      subject: faculty.subject
    });
    setShowModal(true);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    if (!token) {
      setMessage('You must be logged in to update faculty');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/masterAdmin/faculty/update/${selectedFaculty.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      setShowModal(false);  // Close the modal after successful update
      fetchFaculties();  // Refresh the faculty list
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update faculty');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center">Faculty List</h1>

      {message && (
        <Alert variant="danger" className="mt-3">
          {message}
        </Alert>
      )}

      {/* Display faculty list in a table */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Branch</th>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculty.map((faculty) => (
            <tr key={faculty.id}>
              <td>{faculty.name}</td>
              <td>{faculty.username}</td>
              <td>{faculty.branch}</td>
              <td>{faculty.subject}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleUpdate(faculty)}>
                  <BsPencil /> Update
                </Button>
                <Button variant="danger" onClick={() => handleDelete(faculty.id)}>
                  <BsTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for updating faculty */}
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Faculty</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitUpdate}>
              <Form.Group controlId="formFacultyName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formFacultyUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="facultyUsername"
                  value={formData.facultyUsername} // Bind value to formData.facultyUsername
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBranch">
                <Form.Label>Branch</Form.Label>
                <Form.Control
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default FetchFaculty;

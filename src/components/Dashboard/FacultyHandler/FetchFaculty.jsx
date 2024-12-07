import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Modal, Form, Alert, Spinner, Card } from "react-bootstrap";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false); // for delete confirmation
  const [loading, setLoading] = useState(false); // loader state
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    facultyUsername: '',
    branch: '',
    subject: ''
  });

  // Fetch faculties
  const fetchFaculties = async () => {
    setLoading(true); // Start loader
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const decodedToken = decodeJWT(token);
      if (!decodedToken || !decodedToken.masterAdmin) {
        throw new Error("Invalid token: masterAdminId missing.");
      }

      const response = await axios.get(`https://attendancetracker-backend1.onrender.com/api/masterAdmin/faculty/getFaculty/${decodedToken.masterAdmin}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFaculty(response.data.facultyMembers);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to fetch faculty');
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleDelete = async (id) => {
    setLoading(true); // Start loader while deleting
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
      const response = await axios.delete(`https://attendancetracker-backend1.onrender.com/api/masterAdmin/faculty/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setMessage(response.data.message);
  
      // Remove the faculty from the state to reflect the UI changes immediately
      setFaculty(faculty.filter((facultyItem) => facultyItem.id !== id));
      setShowDeleteModal(false); // Close the confirmation modal
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete faculty');
    } finally {
      setLoading(false); // Stop loader after deletion
    }
  };

  const handleUpdate = (faculty) => {
    setSelectedFaculty(faculty);
    setFormData({
      name: faculty.name,
      facultyUsername: faculty.username,
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
      const response = await axios.put(`https://attendancetracker-backend1.onrender.com/api/masterAdmin/faculty/update/${selectedFaculty.id}`, formData, {
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

      {/* Loader while data is being fetched */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* Display faculty list in cards */}
      {!loading && faculty.length > 0 && (
        <Row className="mt-3">
          {faculty.map((faculty) => (
            <Col sm={12} md={6} lg={4} key={faculty.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{faculty.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{faculty.branch}</Card.Subtitle>
                  <Card.Text>
                    <strong>Username:</strong> {faculty.username}<br />
                    <strong>Subject:</strong> {faculty.subject}
                  </Card.Text>
                  <Button variant="warning" className="me-2" onClick={() => handleUpdate(faculty)}>
                    <BsPencil /> Update
                  </Button>
                  <Button variant="danger" onClick={() => { setSelectedFaculty(faculty); setShowDeleteModal(true); }}>
                    <BsTrash /> Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

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
                  value={formData.facultyUsername}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Faculty</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete the faculty member: {selectedFaculty?.name}?</p>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDelete(selectedFaculty?.id)}>
                Confirm Delete
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default FetchFaculty;

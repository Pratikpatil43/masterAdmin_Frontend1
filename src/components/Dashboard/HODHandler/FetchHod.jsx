import React, { useState, useEffect } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

// Manually decode JWT
const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

const FetchHod = () => {
  const [hods, setHods] = useState([]); // State to hold the list of HODs
  const [error, setError] = useState(""); // State to hold error message
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [currentHod, setCurrentHod] = useState(null); // State to hold the current HOD being edited
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    branch: "",
  });

  useEffect(() => {
    const fetchHods = async () => {
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

        // Fetch HODs using the retrieved masterAdminId
        const hodsResponse = await axios.get(
          `http://localhost:5000/api/masterAdmin/hod/getHod/${decodedToken.masterAdmin}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the response data has the required format and set the state
        if (hodsResponse.data && Array.isArray(hodsResponse.data.hods)) {
          setHods(hodsResponse.data.hods); // Update the state with fetched HODs
        } else {
          throw new Error("Invalid HODs data format");
        }
      } catch (err) {
        setError("Failed to fetch HODs: " + err.message);
      }
    };

    fetchHods();
  }, []); // Empty dependency array to run once on component mount

  const handleDelete = async (id) => {
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

      // Delete HOD using the id and token for authentication
      await axios.delete(`http://localhost:5000/api/masterAdmin/hod/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHods((prevHods) => prevHods.filter((hod) => hod._id !== id)); // Remove deleted HOD from the list
    } catch (err) {
      setError("Failed to delete HOD: " + err.message);
    }
  };

  const handleUpdate = (hod) => {
    setCurrentHod(hod);
    setFormData({
      name: hod.name,
      username: hod.username,
      password: "",
      branch: hod.branch,
    });
    setShowModal(true); // Show the modal
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentHod(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async () => {
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

      // Update HOD using the id and token for authentication
      const response = await axios.put(
        `http://localhost:5000/api/masterAdmin/hod/update/${currentHod._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the HOD list with the updated HOD
      setHods((prevHods) =>
        prevHods.map((hod) =>
          hod._id === currentHod._id ? { ...hod, ...updatedData } : hod
        )
      );
      setShowModal(false); // Close the modal after the update
      setCurrentHod(null);
    } catch (err) {
      setError("Failed to update HOD: " + err.message);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">List of HODs</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Display message if no HODs */}
      {hods.length === 0 && !error && (
        <div className="alert alert-info" role="alert">
          Currently, no HODs are available.
        </div>
      )}

      {/* Desktop View (Table) */}
      <div className="d-none d-md-block">
        <table className="table table-bordered mt-3">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Branch</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(hods) &&
              hods.map((hod) => (
                <tr key={hod._id}>
                  <td>{hod.name}</td>
                  <td>{hod.username}</td>
                  <td>{hod.branch}</td>
                  <td>{hod.role}</td>
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdate(hod)} // Trigger update
                    >
                      <BsPencil />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(hod._id)} // Use '_id' for delete
                    >
                      <BsTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Cards) */}
      <div className="d-block d-md-none">
        <Row>
          {Array.isArray(hods) &&
            hods.map((hod) => (
              <Col key={hod._id} xs={12} md={6} lg={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{hod.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {hod.username}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Branch:</strong> {hod.branch}
                      <br />
                      <strong>Role:</strong> {hod.role}
                    </Card.Text>
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => handleUpdate(hod)} // Trigger update
                    >
                      <BsPencil />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(hod._id)} // Use '_id' for delete
                    >
                      <BsTrash />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </div>

      {/* Modal for Updating HOD */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update HOD</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group controlId="formBranch">
              <Form.Label>Branch</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter branch"
                name="branch"
                value={formData.branch}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdateSubmit}>
              Update HOD
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FetchHod;

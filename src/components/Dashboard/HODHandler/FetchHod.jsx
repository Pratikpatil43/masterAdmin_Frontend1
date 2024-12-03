import React, { useState, useEffect } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

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
  const [hods, setHods] = useState([]);  // State to hold the list of HODs
  const [error, setError] = useState("");  // State to hold error message

  useEffect(() => {
    const fetchHods = async () => {
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

        // Fetch HODs using the retrieved masterAdminId
        const hodsResponse = await axios.get(
          `http://localhost:5000/api/masterAdmin/hod/getHod/${decodedToken.masterAdmin}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("HODs Response:", hodsResponse.data); // Log the HODs data

        // Check if the response data has the required format and set the state
        if (hodsResponse.data && Array.isArray(hodsResponse.data.hods)) {
          setHods(hodsResponse.data.hods);  // Update the state with fetched HODs
        } else {
          throw new Error("Invalid HODs data format");
        }
      } catch (err) {
        setError("Failed to fetch HODs: " + err.message);
      }
    };

    fetchHods();
  }, []);  // Empty dependency array to run once on component mount

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      // Decode the JWT token using the custom decodeJWT function
      const decodedToken = decodeJWT(token);
      if (!decodedToken || !decodedToken.masterAdminId) {
        throw new Error("Invalid token: masterAdminId missing.");
      }

      // Delete HOD using the id and token for authentication
      await axios.delete(`http://localhost:5000/api/masterAdmin/hod/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHods(hods.filter((hod) => hod._id !== id)); // Remove deleted HOD from the list
    } catch (err) {
      setError("Failed to delete HOD: " + err.message);
    }
  };

  const handleUpdate = (id) => {
    console.log("Updating HOD with ID:", id);
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
            {Array.isArray(hods) && hods.map((hod) => (
              <tr key={hod._id}>
                <td>{hod.name}</td>
                <td>{hod.username}</td>
                <td>{hod.branch}</td>
                <td>{hod.role}</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdate(hod._id)}
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
          {Array.isArray(hods) && hods.map((hod) => (
            <Col key={hod._id} xs={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{hod.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{hod.username}</Card.Subtitle>
                  <Card.Text>
                    <strong>Branch:</strong> {hod.branch}
                    <br />
                    <strong>Role:</strong> {hod.role}
                  </Card.Text>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleUpdate(hod._id)}
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
    </Container>
  );
};

export default FetchHod;

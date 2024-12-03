import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Manually decode the JWT token
  const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  // Fetch requests from the backend
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setError('No token found');
        setLoading(false);
        return;
      }

      const decodedToken = decodeJWT(token);
      if (!decodedToken || !decodedToken.masterAdminId) {
        console.error('Invalid token: masterAdminId missing');
        setError('Invalid token: masterAdminId missing');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/masterAdmin/getRequests/${decodedToken.masterAdminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('API Response:', response.data);

      if (response.data && response.data.requests) {
        setRequests(response.data.requests);
      } else {
        setError('No requests found');
      }

      setLoading(false);
      setError(null); // Reset error if successful
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
      setError('Error fetching requests');
    }
  };

  // Handle approve or reject action
  const approveOrRejectRequest = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/approve-reject-request',
        { requestId, action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      fetchRequests(); // Re-fetch requests to reflect the updated status
    } catch (error) {
      console.error('Error processing request:', error);
      alert('Error processing request');
    }
  };

  // UseEffect hook to fetch requests when the component mounts
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Requests Table</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : error ? (
        <p>{error}</p> // Display the error message if there was an issue
      ) : requests.length === 0 ? (
        <p>No requests available</p> // Handle empty requests array
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Faculty Username</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.data.name}</TableCell>
                  <TableCell>{request.data.facultyUsername}</TableCell>
                  <TableCell>{request.data.branch}</TableCell>
                  <TableCell>{request.data.subject}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => approveOrRejectRequest(request._id, 'approve')}
                          style={{ marginRight: '10px' }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => approveOrRejectRequest(request._id, 'reject')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {request.status !== 'pending' && <span>{request.status}</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Request;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Function to decode JWT token
const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null); // Track the action loading state
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          setError('Authorization token is missing');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/masterAdmin/getRequests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setRequests(response.data.data); // Set the fetched requests
        } else {
          setError('Failed to fetch requests.');
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('An error occurred while fetching requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      setLoadingAction(requestId); // Show spinner for this action
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      // Decode the JWT token using the custom decodeJWT function
      const decodedToken = decodeJWT(token);
      if (!decodedToken || !decodedToken.masterAdmin) {
        throw new Error("Invalid token: masterAdminId missing.");
      }
  
      const response = await axios.post(
        `http://localhost:5000/api/masterAdmin/approveRejectRequest`,
        { requestId, action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId ? { ...req, status: action } : req
          )
        );
      } else {
        setSuccessMessage(`Request has been ${action}ed successfully. Refresh your application.`);
      }
    } catch (err) {
      console.error('Error updating request status:', err);
      setSuccessMessage('An error occurred while updating the status.');
    } finally {
      setLoadingAction(null); // Hide spinner after action is complete
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading requests...</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Requests</h1>

      {/* Display success message */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {requests.length === 0 ? (
        <p className="text-center">No requests found.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Request ID</th>
              <th>Name</th>
              <th>Faculty Username</th>
              <th>Branch</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Action</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request._id}</td>
                <td>{request.data?.name || 'N/A'}</td>
                <td>{request.facultyUsername}</td>
                <td>{request.branch}</td>
                <td>{request.subject}</td>
                <td>{request.status}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleAction(request._id, 'approve')}
                      disabled={loadingAction === request._id} // Disable button while loading
                    >
                      {loadingAction === request._id ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        'Approve'
                      )}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleAction(request._id, 'reject')}
                      disabled={loadingAction === request._id} // Disable button while loading
                    >
                      {loadingAction === request._id ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        'Reject'
                      )}
                    </button>
                  </div>
                </td>
                <td>{new Date(request.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Request;

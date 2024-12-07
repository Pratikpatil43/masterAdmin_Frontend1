import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Request.css'

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
  const [filteredRequests, setFilteredRequests] = useState([]); // To store filtered requests
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null); // Track the action loading state
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          setError('Please Login to make operations');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://attendancetracker-backend1.onrender.com/api/masterAdmin/getRequests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setRequests(response.data.data); // Set the fetched requests
          setFilteredRequests(response.data.data); // Initialize filtered requests
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

  // Function to filter requests based on search query
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = requests.filter((request) =>
      request.facultyUsername.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredRequests(filtered);
  };

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
        `https://attendancetracker-backend1.onrender.com/api/masterAdmin/approveRejectRequest`,
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

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Faculty Username"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Display success message */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {filteredRequests.length === 0 ? (
        <p className="text-center">No requests found.</p>
      ) : (
        <div className="table-responsive">
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
  {filteredRequests.map((request) => (
    <tr
      key={request._id}
      className={request.status === 'approved' || request.status === 'rejected' ? 'disabled-row' : ''}
    >
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
            disabled={loadingAction === request._id || request.status === 'approved'} // Disable if approved
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
            disabled={loadingAction === request._id || request.status === 'rejected'} // Disable if rejected
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
        </div>
      )}
    </div>
  );
};

export default Request;

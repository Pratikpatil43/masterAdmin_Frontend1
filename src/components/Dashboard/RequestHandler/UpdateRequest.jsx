import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateRequest = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(null); // Track action loading state
  const [successMessage, setSuccessMessage] = useState("");
  const [searchUsername, setSearchUsername] = useState(""); // Track the search input

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          setError("Please Login to make operations");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://attendancetracker-backend1.onrender.com/api/masterAdmin/getupdateRequests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.data) {
          setRequests(response.data.data);
          setFilteredRequests(response.data.data); // Initially set filtered data to all requests
        } else {
          setRequests([]);
          setFilteredRequests([]);
        }
      } catch (err) {
        setError("Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSearch = (e) => {
    setSearchUsername(e.target.value);
    if (e.target.value === "") {
      setFilteredRequests(requests); // Show all if search is empty
    } else {
      const filtered = requests.filter((request) =>
        request.facultyUsername.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  };

  const handleAction = async (requestId, action, type = "update") => {
    try {
      setLoadingAction(requestId); // Show spinner for this action

      const token = sessionStorage.getItem("token");

      if (!token) {
        setError("Authorization token is missing");
        return;
      }

      const endpoint =
        type === "remove"
          ? "https://attendancetracker-backend1.onrender.com/api/masterAdmin/removeRequest"
          : "https://attendancetracker-backend1.onrender.com/api/masterAdmin/updateRequest";

      const response = await axios.post(
        endpoint,
        { requestId, action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update request status in the state after the action
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.RequestId === requestId
            ? { ...request, status: action === "approve" ? "approved" : "rejected" }
            : request
        )
      );

      setSuccessMessage(`Request has been ${action}ed successfully.`);
    } catch (err) {
      setSuccessMessage("Failed to process the request.");
    } finally {
      setLoadingAction(null); // Hide spinner after action is complete
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Update & Removal Requests</h2>

      {/* Search Box */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Faculty Username"
          value={searchUsername}
          onChange={handleSearch}
        />
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {/* Responsive Table for Desktop and Tablets */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="bg-primary text-white">
            <tr>
              <th>Request ID</th>
              <th>Faculty Username</th>
              <th>Action</th>
              <th>Status</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredRequests) && filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request.RequestId}>
                  <td>{request.RequestId}</td>
                  <td>{request.facultyUsername}</td>
                  <td>{request.action}</td>
                  <td>
                    <span
                      className={`badge ${
                        request.status === "approved"
                          ? "bg-success"
                          : request.status === "rejected"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {request.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p><strong>Requested Action:</strong> {request.action}</p>
                      {request.action === "update" && (
                        <div>
                          <p><strong>Update Details:</strong></p>
                          <ul className="list-unstyled">
                            {Object.keys(request.data).map((key, idx) => (
                              <li key={idx}>
                                <strong>{key}:</strong> {request.data[key]}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {request.action === "remove" && (
                        <div>
                          <p><strong>Removal Reason:</strong> {request.data.reason}</p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    {request.status === "pending" && (
                      <>
                        {request.action === "update" && (
                          <button
                            className="btn btn-success btn-sm me-2 mb-2 mb-sm-0"
                            onClick={() => handleAction(request.RequestId, "approve", "update")}
                            disabled={loadingAction === request.RequestId}
                          >
                            {loadingAction === request.RequestId ? (
                              <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              "Approve Update"
                            )}
                          </button>
                        )}
                        {request.action === "remove" && (
                          <button
                            className="btn btn-warning btn-sm me-2 mb-2 mb-sm-0"
                            onClick={() => handleAction(request.RequestId, "approve", "remove")}
                            disabled={loadingAction === request.RequestId}
                          >
                            {loadingAction === request.RequestId ? (
                              <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              "Approve Removal"
                            )}
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm mb-2 mb-sm-0"
                          onClick={() => handleAction(request.RequestId, "reject")}
                          disabled={loadingAction === request.RequestId}
                        >
                          {loadingAction === request.RequestId ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : (
                            "Reject"
                          )}
                        </button>
                      </>
                    )}
                    {request.status !== "pending" && (
                      <span className="text-muted">{request.status.toUpperCase()}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpdateRequest;

// ViewProfile.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://attendancetracker-backend1.onrender.com/api/masteradmin/profile", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            
          },
        });
        setProfile(response.data.profile);
      } catch (err) {
        setError(err.response ? err.response.data.message : "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h3>Master Admin Profile</h3>
          <button
            className="btn btn-light btn-sm"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
        <div className="card-body">
          {profile ? (
            <>
              <div className="row mb-3">
                <div className="col-md-4 font-weight-bold">ID:</div>
                <div className="col-md-8">{profile.id}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 font-weight-bold">Name:</div>
                <div className="col-md-8">{profile.name}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 font-weight-bold">Username:</div>
                <div className="col-md-8">{profile.username}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 font-weight-bold">Role:</div>
                <div className="col-md-8">{profile.role}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 font-weight-bold">Master Admin:</div>
                <div className="col-md-8">{profile.role === 'masterAdmin' ? "Yes" : "No"}</div>
              </div>
            </>
          ) : (
            <div className="text-danger">Profile data not available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;

import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader

        try {
            const response = await axios.put('https://attendancetracker-backend1.onrender.com/api/masterAdmin/forgetPassword', {
                username,
                newPassword,
            });

            if (response.status === 200) {
                setMessage(response.data.message);
                setIsPasswordUpdated(true); // Indicate password update success
            } else {
                setMessage(response.data.message || 'Failed to update the password.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage(error.response?.data?.message || 'An error occurred while updating the password.');
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f4f4f4' }}>
            <div
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    padding: '20px',
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h3
                    className="text-center mb-4"
                    style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '700', color: '#333' }}
                >
                    Forgot Password
                </h3>
                {message && <div className="alert alert-info text-center">{message}</div>}

                {isPasswordUpdated ? (
                    // Show login button after successful password update
                    <div className="text-center">
                        <p>Your password has been updated successfully!</p>
                        <a
                            href="/login"
                            className="btn btn-success"
                            style={{
                                padding: '10px',
                                fontWeight: '600',
                                background: '#4CAF50',
                                border: 'none',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                color: '#fff',
                            }}
                        >
                            Go to Login
                        </a>
                    </div>
                ) : (
                    // Show form for password update
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label" style={{ fontWeight: '600' }}>
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label" style={{ fontWeight: '600' }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter your new password"
                                required
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            style={{ padding: '10px', fontWeight: '600', background: '#4c56cc', border: 'none', borderRadius: '6px' }}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? (
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ marginRight: '5px' }}
                                ></span>
                            ) : null}
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;

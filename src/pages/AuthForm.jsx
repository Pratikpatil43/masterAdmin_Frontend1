import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const AuthForm = ({ type, onSubmit }) => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState(''); // New state for the name
    const [role] = useState('masterAdmin');  // Default role set to 'masterAdmin'
    const navigate = useNavigate();  // Use useNavigate instead of useHistory

    // Determine password visibility based on form type
    const passwordType = type === 'login' ? 'password' : 'text';  // 'password' for login, 'text' for register

    // Check if token is set in sessionStorage on component mount
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            // If token is set, redirect to dashboard
            navigate('/dashboard');
        }
    }, [navigate]);

    // Handle form submission for register
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent form from reloading page
      
        const payload = {
          username,
          password,
          name,  // Include name in the payload (only for register)
          role: 'masterAdmin',  // Default role set to 'masterAdmin'
        };
      
        const url = type === 'login'
          ? 'http://localhost:5000/api/masterAdmin/login'
          : 'http://localhost:5000/api/masterAdmin/register'; // Ensure this is for registration
      
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
      
          const result = await response.json();
      
          if (response.status === 201 || response.status === 200) {
            // Success, handle successful registration/login
            alert(result.message);
            
            if (type === 'login') {
              // Set token in session storage for 4 hours
              const expirationTime = new Date().getTime() + 4 * 60 * 60 * 1000; // 4 hours from now
              sessionStorage.setItem('token', result.token);
              sessionStorage.setItem('tokenExpiration', expirationTime);
      
              // Redirect to dashboard after login
              navigate('/dashboard');
            } else {
              navigate('/login');  // Redirect to login page after successful registration
            }
          } else {
            // Handle errors
            alert(result.message || 'Error during authentication');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while processing your request');
        }
      };
      

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f4f4f4' }}>
            <div style={{ maxWidth: '450px', width: '100%' }}>
                {/* Title Outside the Box */}
                <h3 className="text-center mb-4" style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: '700',
                    fontSize: '24px',
                    color: '#333',
                    marginBottom: '30px'
                }}>
                    {type === 'login' ? 'Principal Admin Login' : 'Principal Admin Register'}
                </h3>

                <Form onSubmit={handleSubmit} className="p-4 shadow-lg" style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '30px 40px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease',
                }}>
                    {/* Name Field (Only for Register) */}
                    {type === 'register' && (
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                size="sm"
                                style={{
                                    fontSize: '14px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </Form.Group>
                    )}

                    {/* Username Field */}
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            size="sm"
                            style={{
                                fontSize: '14px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            }}
                        />
                    </Form.Group>

                    {/* Password Field */}
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Password</Form.Label>
                        <Form.Control
                            type={passwordType}  // Dynamically change type
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            size="sm"
                            style={{
                                fontSize: '14px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            }}
                        />
                    </Form.Group>

                    {/* Role Selector (Register Only) */}
                    {type === 'register' && (
                        <Form.Group className="mb-3" controlId="formBasicRole">
                            <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Role</Form.Label>
                            <Form.Control
                                as="select"
                                value={role}
                                disabled
                                size="sm"
                                style={{
                                    fontSize: '14px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd'
                                }}
                            >
                                <option value="masterAdmin">masterAdmin</option>
                            </Form.Control>
                        </Form.Group>
                    )}

                    {/* Submit Button */}
                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        size="lg"
                        style={{
                            backgroundColor: '#4c56cc',
                            border: 'none',
                            padding: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            borderRadius: '8px'
                        }}
                    >
                        {type === 'login' ? 'Login' : 'Register'}
                    </Button>
                </Form>

                {/* Link to the other page */}
                {type === 'login' ? (
                    <p className="mt-3 text-center">
                        Don't have an account? <RouterLink to="/register">Register</RouterLink>
                    </p>
                ) : (
                    <p className="mt-3 text-center">
                        Already have an account? <RouterLink to="/login">Login</RouterLink>
                    </p>
                )}
            </div>
        </div>
    );
};

export default AuthForm;

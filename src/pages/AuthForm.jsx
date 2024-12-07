import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const AuthForm = ({ type, onSubmit }) => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [role] = useState('masterAdmin');
    const [message, setMessage] = useState({ text: '', type: '' }); // State for message
    const navigate = useNavigate();

    const passwordType = type === 'login' ? 'password' : 'text';

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            username,
            password,
            name,
            role,
        };

        const url = type === 'login'
            ? 'https://attendancetracker-backend1.onrender.com/api/masterAdmin/login'
            : 'https://attendancetracker-backend1.onrender.com/api/masterAdmin/register';

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
                setMessage({ text: result.message, type: 'success' }); // Set success message
                setTimeout(() => {
                    setMessage({ text: '', type: '' }); // Clear message after 3 seconds
                    if (type === 'login') {
                        const expirationTime = new Date().getTime() + 4 * 60 * 60 * 1000;
                        sessionStorage.setItem('token', result.token);
                        sessionStorage.setItem('tokenExpiration', expirationTime);
                        navigate('/dashboard');
                    } else {
                        navigate('/login');
                    }
                }, 3000);
            } else {
                setMessage({ text: result.message || 'Error during authentication', type: 'error' });
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage({ text: 'An error occurred while processing your request', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f4f4f4' }}>
            <div style={{ maxWidth: '450px', width: '100%' }}>
                <h3 className="text-center mb-4" style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: '700',
                    fontSize: '24px',
                    color: '#333',
                    marginBottom: '30px'
                }}>
                    {type === 'login' ? 'Principal Admin Login' : 'Principal Admin Register'}
                </h3>

                {/* Display Message */}
                {message.text && (
                    <div style={{
                        color: message.type === 'success' ? 'green' : 'red',
                        textAlign: 'center',
                        marginBottom: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }}>
                        {message.text}
                    </div>
                )}

                <Form onSubmit={handleSubmit} className="p-4 shadow-lg" style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '30px 40px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease',
                }}>
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
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Password</Form.Label>
                        <Form.Control
                            type={passwordType}
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
                    {type === 'login' && (
                        <div className="mb-3 text-center">
                            <RouterLink to="/forgot-password" style={{ fontSize: '14px', color: '#4c56cc', textDecoration: 'none' }}>
                                Forgot Password?
                            </RouterLink>
                        </div>
                    )}
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

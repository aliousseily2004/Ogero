import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Custom styling

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const savedToken = localStorage.getItem('jwtToken');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const showMessage = (msg, type = 'success') => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(''), 5000);
    };

    const handleAuth = async (endpoint) => {
        setMessage('');
        try {
            const url = `http://localhost:8081/api/auth/${endpoint}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `${endpoint} failed`);
            }

            if (endpoint === 'login') {
                const jwt = await res.text();
                setToken(jwt);
                localStorage.setItem('jwtToken', jwt);
                showMessage('Login successful!', 'success');
                navigate('/users');
            } else {
                showMessage('User registered successfully! You can now log in.', 'success');
                setIsRegistering(false);
            }
        } catch (err) {
            showMessage(`Error: ${err.message}`, 'error');
            setToken('');
            localStorage.removeItem('jwtToken');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setToken('');
        showMessage('You have been logged out.', 'success');
        navigate('/login');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>{isRegistering ? 'Register' : 'Log In'}</h1>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {token ? (
                    <>
                        <div className="token-display">
                            <strong>JWT Token:</strong>
                            <pre>{token}</pre>
                        </div>
                        <button className="auth-button logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            onClick={() => handleAuth(isRegistering ? 'register' : 'login')}
                            className="auth-button"
                        >
                            {isRegistering ? 'Register' : 'Login'}
                        </button>

                        <div className="toggle-link">
                            {isRegistering ? (
                                <>
                                    Already have an account?{' '}
                                    <button onClick={() => { setIsRegistering(false); setMessage(''); }}>
                                        Log In
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{' '}
                                    <button onClick={() => { setIsRegistering(true); setMessage(''); }}>
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;

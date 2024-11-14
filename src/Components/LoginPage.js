// src/components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import axios from 'axios';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', {
                email,
                password,
            });
            console.log(response.data);
            if (response.status === 200) {
                navigate('/homepage');
            }
        } catch (error) {
            console.error('Login failed:', error.response.data.message);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-page">
            <header className="header">
                <div className="header-left">Contact Manager</div>
                <div className="header-right">
                    <button className="header-button active">Login</button>
                    <button className="header-button" onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </header>
            <main className="login-section">
                <div className="login-container">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit" className="login-button">Login</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default LoginPage;




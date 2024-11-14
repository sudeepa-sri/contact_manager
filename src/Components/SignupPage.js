import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import axios from 'axios';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/signup', {
                email,
                password,
            });
            alert(response.data.message); // Access the message from the response
            navigate('/login');
        } catch (error) {
            if (error.response) {
                console.error('Signup failed:', error.response.data.message);
                alert('Signup failed: ' + error.response.data.message);
            } else {
                console.error('Error:', error);
                alert('Signup failed. Please try again later.');
            }
        }
    };

    return (
        <div className="signup-page">
            <header className="header">
                <div className="header-left">Contact Manager</div>
                <div className="header-right">
                    <button className="header-button" onClick={() => navigate('/login')}>Login</button>
                    <button className="header-button active">Sign Up</button>
                </div>
            </header>
            <main className="signup-section">
                <div className="signup-container">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignup}>
                        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit" className="submit-button">Sign Up</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default SignupPage;



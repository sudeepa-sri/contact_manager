// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <header className="header">
                <div className="header-left">Contact Manager</div>
                <div className="header-right">
                    <button className="header-button" onClick={() => navigate('/login')}>Login</button>
                    <button className="header-button" onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </header>
            <main className="welcome-section">
                <div className="welcome-content">
                    <h1>Welcome to Contact Manager</h1>
                    <p>"Your one-stop solution to manage all your personal and professional contacts effortlessly!"</p>
                </div>
                
            </main>
        </div>
    );
}

export default LandingPage;


// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './Components/LoginPage';
import SignupPage from './Components/SignupPage';
import HomePage from './Components/HomePage';
import AddContactPage from './Components/AddContactPage';
import LandingPage from './Components/LandingPage'; 
import EditContactPage from './Components/EditContactPage';

import './App.css';
import ToDoListPage from './Components/ToDoListPage';







function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage />} /> 
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/homepage" element={<HomePage />} />
                    <Route path="/addcontact" element={<AddContactPage />} />
                    <Route path="/edit/:id" element={<EditContactPage />} /> 
                    <Route path="/todo" element={<ToDoListPage />} />
                    
                    
                    
                  
                   
                </Routes>
            </div>
        </Router>
    );
}

export default App;


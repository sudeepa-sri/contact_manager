// src/components/AddContactPage.js
import React, { useState } from 'react';
import './AddContactPage.css'; // Create a new CSS file for styles
import { useNavigate } from 'react-router-dom';

function AddContactPage() {
    const [newContact, setNewContact] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        birthday: '',
        is_favorite: false, // Default to false
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewContact({ ...newContact, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/add_contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newContact),
            });

            if (response.ok) {
                console.log("New Contact Added");
                navigate('/homepage'); // Redirect to home page after adding contact
            } else {
                console.error("Failed to add contact");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="add-contact-page">
            <header className="header">
                <div className="logo">Contact Manager</div>
                <div className="header-right" onClick={() => navigate('/homepage')}>Home</div>
                
            </header>

            <main className="main-content">
                <h1>Add New Contact</h1>
                <form onSubmit={handleFormSubmit} className="contact-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newContact.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newContact.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={newContact.phone}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={newContact.location}
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        name="birthday"
                        value={newContact.birthday}
                        onChange={handleInputChange}
                    />
                    <label>
                        <input
                            type="checkbox"
                            name="is_favorite"
                            checked={newContact.is_favorite}
                            onChange={(e) => setNewContact({ ...newContact, is_favorite: e.target.checked })}
                        />
                        Mark as Favorite
                    </label>
                    <button type="submit" className="submit-button">Save Contact</button>
                </form>
            </main>
        </div>
    );
}

export default AddContactPage;


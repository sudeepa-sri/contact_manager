import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditContactPage.css';

const EditContactPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        birthday: '',
        is_favorite: false,
    });
    const [initialBirthday, setInitialBirthday] = useState('');

    useEffect(() => {
        const fetchContact = async () => {
            const response = await fetch(`http://localhost:5000/contact/${id}`);
            if (response.ok) {
                const data = await response.json();
                setContact(data);
                setInitialBirthday(data.birthday);
            } else {
                console.error('Contact not found');
            }
        };

        fetchContact();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setContact((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct payload with changed fields only
        const updatePayload = {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            location: contact.location,
            is_favorite: contact.is_favorite,
        };

        // Include birthday only if it's changed
        if (contact.birthday !== initialBirthday) {
            updatePayload.birthday = contact.birthday;
        }

        const response = await fetch(`http://localhost:5000/edit_contact/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatePayload),
        });

        if (response.ok) {
            navigate('/homepage');
        } else {
            console.error('Failed to update contact');
        }
    };

    return (
        <div className="edit-contact-page">
            <header className="header">
                <h1>Contact Manager</h1>
                <div className="header-right" onClick={() => navigate('/homepage')}>Home</div>
            </header>
            <h2 className="edit-contact-title">Edit Contact</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={contact.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    name="phone"
                    value={contact.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    required
                />
                <input
                    type="text"
                    name="location"
                    value={contact.location}
                    onChange={handleChange}
                    placeholder="Location"
                />
                <input
                    type="date"
                    name="birthday"
                    value={contact.birthday.split('T')[0]}
                    onChange={handleChange}
                />
                <label>
                    <input
                        type="checkbox"
                        name="is_favorite"
                        checked={contact.is_favorite}
                        onChange={handleChange}
                    />
                    Favorite
                </label>
                <button type="submit" className="submit-button">Update Contact</button>
            </form>
        </div>
    );
};

export default EditContactPage;






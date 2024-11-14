import React, { useState, useEffect } from 'react'; // Add useState and useEffect here
import { Link } from 'react-router-dom'; // Add Link import here
import './HomePage.css';

function HomePage() {
    //const userName = "User"; // Replace with the actual user's name after login
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFavorites, setShowFavorites] = useState(false);
    const [showBirthdays, setShowBirthdays] = useState(false);
    const [showMonthwise, setShowMonthwise] = useState(false); // State for Monthwise filter
    const [showYearwise, setShowYearwise] = useState(false); // State for Yearwise filter


   


    useEffect(() => {
        const fetchContacts = async () => {
            const response = await fetch('http://localhost:5000/contacts');
            const data = await response.json();
            setContacts(data);
        };

        fetchContacts();
    }, []);

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:5000/delete_contact/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setContacts(contacts.filter(contact => contact.id !== id));
        } else {
            console.error('Failed to delete contact');
        }
    };

    const isBirthdaySoon = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        birthDate.setFullYear(today.getFullYear());
        const differenceInTime = birthDate - today;
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
        return differenceInDays >= 0 && differenceInDays <= 10;
    };

    const isBirthdayInCurrentMonth = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);

        // Extract the current month and year
        const currentMonth = today.getMonth(); // getMonth() returns 0-11, so no need to add 1
        const currentYear = today.getFullYear();

        // Set the year of birthDate to the current year
        birthDate.setFullYear(currentYear);

        // Check if the birthday is in the current month
        if (birthDate.getMonth() !== currentMonth) {
            return false; // Birthday is not in the current month
        }

        // Ensure the birthday is today or in the future in the current month
        if (birthDate < today) {
            return false; // Birthday is in the past
        }

        return true; // The birthday is in the current month and is today or upcoming
    };

    const isBirthdayThisYear = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        
        // Set the birthday year to the current year
        const currentYear = today.getFullYear();
        birthDate.setFullYear(currentYear);

        // Check if the birthday is between today and the end of the year
        const endOfYear = new Date(currentYear, 11, 31); // Dec 31st of the current year

        return birthDate >= today && birthDate <= endOfYear;
    };

    // Filters contacts based on search term and selected view
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtered contacts for favorites, birthdays, and monthwise
    const displayedContacts = showFavorites
        ? filteredContacts.filter(contact => contact.is_favorite)
        : showBirthdays
        ? filteredContacts.filter(contact => isBirthdaySoon(contact.birthday))
        : showMonthwise
        ? filteredContacts.filter(contact => isBirthdayInCurrentMonth(contact.birthday))
        : showYearwise
        ? filteredContacts.filter(contact => isBirthdayThisYear(contact.birthday))
        : filteredContacts;

        const sortedContacts = displayedContacts
        .sort((a, b) => {
            // Check if we're in one of the birthday views (upcoming, monthwise, yearwise)
            if (showBirthdays || showMonthwise || showYearwise) {
                // Sorting by birthday (date-based sorting)
                const dateA = new Date(a.birthday);
                const dateB = new Date(b.birthday);
                
                // Set both dates to the same year to avoid sorting by year
                const today = new Date();
                dateA.setFullYear(today.getFullYear());
                dateB.setFullYear(today.getFullYear());
            
                // Sort by day/month
                return dateA - dateB; // Ascending order by day/month
            } else {
                // Default alphabetical sorting by name (for Home and Favorites views)
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            }
        });
    

    return (
        <div className="home-page">
            <header className="header">
                <div className="logo">Contact Manager</div>
                <nav className="navigation">
                    <button className="nav-button" onClick={() => { setShowFavorites(false); setShowBirthdays(false); setShowMonthwise(false); setShowYearwise(false); }}>Home</button>
                    <button className="nav-button" onClick={() => { setShowFavorites(true); setShowBirthdays(false); setShowMonthwise(false); setShowYearwise(false); }}>Favorites</button>
                    <button className="nav-button" onClick={() => { setShowBirthdays(true); setShowFavorites(false); setShowMonthwise(false); setShowYearwise(false); }}>Upcoming_bd</button>
                    <button className="nav-button" onClick={() => { setShowMonthwise(true); setShowFavorites(false); setShowBirthdays(false); setShowYearwise(false); }}>Monthwise_bd</button>
                    <button className="nav-button" onClick={() => { setShowYearwise(true); setShowFavorites(false); setShowBirthdays(false); setShowMonthwise(false); }}>Yearwise_bd</button>
                    <Link to="/todo" className="nav-button">To-do</Link>
                    <Link to="/" className="nav-button">logout</Link> {/* Updated line */}
                    
                </nav>
            </header>

            <main className="main-content">
                <h1>
                    {showBirthdays ? 'Upcoming Birthdays (Next 10 Days)' : showFavorites ? 'Favorites' : showMonthwise ? 'Upcoming Birthdays This Month' : showYearwise ? 'Upcoming Birthdays This Year' : 'Welcome to Contact Manager!'}
                </h1>
                <div className="search-add">
                    <input
                        type="text"
                        placeholder="Search by name or location"
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* Show Add Contact button only if not in Favorites or Birthday views */}
                    {!showFavorites && !showBirthdays && !showMonthwise && !showYearwise && (
                        <Link to="/addcontact" className="add-contact-button">Add Contact</Link>
                    )}
                </div>

                <table className="contact-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>Birthday</th>
                            <th>Favorites</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedContacts.map(contact => (
                            <tr key={contact.id}>
                                <td className="contact-name">{contact.name}</td>
                                <td className="contact-email">{contact.email}</td>
                                <td className="contact-phone">{contact.phone}</td>
                                <td className="contact-location">{contact.location}</td>
                                <td className="contact-birthday">{new Date(contact.birthday).toLocaleDateString()}</td>
                                <td className="contact-favorite">
                                    {contact.is_favorite ? '⭐' : '☆'}
                                </td>
                                <td className="contact-actions">
                                    <Link to={`/edit/${contact.id}`} className="edit-button">Edit</Link>
                                    <button onClick={() => handleDelete(contact.id)} className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default HomePage;










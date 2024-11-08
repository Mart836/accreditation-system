import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { db, messaging } from "./firebase"; // Ensure this has your Firebase setup
import { collection, onSnapshot } from "firebase/firestore";
import { getToken, onMessage } from "firebase/messaging";
import logo from './brand.png'; // Ensure this path is correct
import './HomePage.css'; // Your CSS file for styling
import notificationBell from './assets/icons/notification-bell.png'; // Ensure this path is correct
import messageIcon from './assets/icons/message-icon.png'; // Ensure this path is correct

const HomePage = () => {
    // State for notifications and messages
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [reply, setReply] = useState("");

    // Refs to handle clicks outside
    const notificationRef = useRef(null);
    const messageRef = useRef(null);
    const messageDropdownRef = useRef(null);
    const notificationDropdownRef = useRef(null);

    // Real-time listener for notifications and messages
    useEffect(() => {
        const unsubscribeNotifications = onSnapshot(collection(db, "notifications"), (snapshot) => {
            const notificationsData = snapshot.docs.map(doc => doc.data());
            setNotifications(notificationsData);
            setUnreadNotifications(notificationsData.length);
        });

        const unsubscribeMessages = onSnapshot(collection(db, "messages"), (snapshot) => {
            const messagesData = snapshot.docs.map(doc => doc.data());
            setMessages(messagesData);
            setUnreadMessages(messagesData.length);
        });

        return () => {
            unsubscribeNotifications();
            unsubscribeMessages();
        };
    }, []);

    useEffect(() => {
        const requestPermission = async () => {
            try {
                const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
                if (token) {
                    console.log("FCM token:", token);
                }
            } catch (error) {
                console.error("Permission denied or error in FCM token", error);
            }
        };

        requestPermission();

        // Handle foreground FCM messages
        onMessage(messaging, (payload) => {
            console.log("Message received in foreground:", payload);
            alert("New notification: " + payload.notification.body);
        });
    }, []);

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        if (unreadNotifications > 0) setUnreadNotifications(0); // Mark all notifications as read
    };

    const handleMessageClick = () => {
        setShowMessages(!showMessages);
        if (unreadMessages > 0) setUnreadMessages(0); // Mark all messages as read
    };

    const handleReplySubmit = () => {
        if (reply) {
            alert(`Reply sent: ${reply}`);
            setReply(""); // Clear the reply text area after submission
        }
    };

    // Hide dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                messageRef.current &&
                !messageRef.current.contains(event.target) && 
                messageDropdownRef.current &&
                !messageDropdownRef.current.contains(event.target)
            ) {
                setShowMessages(false);
            }
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target) && 
                notificationDropdownRef.current &&
                !notificationDropdownRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="container-fluid home-page bg-light">
            <header className="header">
                <img src={logo} alt="Logo" className="logo" />
                <div className="welcome-header">
                    <h1>Welcome to Our Site</h1>
                    <div className="icons2" ref={notificationRef}>
                        <img 
                            src={notificationBell} 
                            alt="Notification Bell" 
                            className="icon notification-icon" 
                            onClick={handleNotificationClick} 
                        />
                        {unreadNotifications > 0 && (
                            <span className="notification-count">{unreadNotifications}</span>
                        )}
                    </div>
                    <div className="icons" ref={messageRef}>
                        <img 
                            src={messageIcon} 
                            alt="Message Icon" 
                            className="icon inbox-icon" 
                            onClick={handleMessageClick} 
                        />
                        {unreadMessages > 0 && (
                            <span className="message-count">{unreadMessages}</span>
                        )}
                    </div>
                </div>

                {/* Notification Dropdown */}
                {showNotifications && (
                    <div className="notification-dropdown" ref={notificationDropdownRef}>
                        <h4>Notifications</h4>
                        {notifications.length > 0 ? (
                            <ul>
                                {notifications.map((notification, index) => (
                                    <li key={index}>{notification}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No notifications</p>
                        )}
                    </div>
                )}

                {/* Messages Dropdown */}
                {showMessages && (
                    <div className="message-dropdown" ref={messageDropdownRef}>
                        <h4>Messages</h4>
                        {messages.length > 0 ? (
                            <ul>
                                {messages.map((message, index) => (
                                    <li key={index}>{message}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No messages</p>
                        )}
                        <div className="message-reply">
                            <textarea 
                                value={reply} 
                                onChange={(e) => setReply(e.target.value)} 
                                placeholder="Type your reply here..." 
                            />
                            <button onClick={handleReplySubmit}>Send Reply</button>
                        </div>
                    </div>
                )}
            </header>
            
            {/* Main Content Section */}
            <main>
            <div className="container my-5 d-flex flex-row align-items-center justify-content-center flex-wrap">
    <div className="card apply-section apply-accreditation text-center shadow-sm mb-4 w-100">
        <Link to="/accreditation-form" className="text-decoration-none">
            <div className="card-body">
            <i className="material-icons">verified</i>
                <h2 className="card-title">Apply for Accreditation</h2>
            </div>
        </Link>
    </div>

    <div className="card apply-section apply-expansion text-center shadow-sm mb-4 w-100">
        <Link to="/Expansionaccreditation-form" className="text-decoration-none">
            <div className="card-body">
            <i className="material-icons">open_in_full</i>
                <h2 className="card-title">Apply for Expansion of Accreditation</h2>
            </div>
        </Link>
    </div>

    <div className="card apply-section apply-reaccreditation text-center shadow-sm mb-4 w-100">
        <Link to="/reaccreditation-form" className="text-decoration-none">
            <div className="card-body">
            <i className="material-icons">refresh</i>
                <h2 className="card-title">Apply for Re-Accreditation</h2>
            </div>
        </Link>
    </div>
    <div className="card apply-section  track-application  text-center shadow-sm mb-4 w-100">
                    <Link to="/track-application" className="text-decoration-none">
                    <div className="card-body">
                    <i className="material-icons">search</i>
                        <h2 className="card-title">Track Your Application</h2>
                        </div>
                    </Link>
                </div>
</div>

   </main>
            {/* Footer */}
            <footer className="footer">
                <p>All rights reserved to Namibia Qualification Authority (NQA)</p>
            </footer>
        </div>
    );
};

export default HomePage;

import React, { createContext, useEffect, useState, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import api from '../api/axios.js'; // Explicit extension

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7001/notificationHub")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log("SignalR Connected"))
            .catch(err => console.error("SignalR Connection Error: ", err));

        connection.on("ReceiveNotification", (message) => {
            const newNotification = {
                id: Date.now(),
                message: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                read: false
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            const newToast = { ...newNotification };
            setToasts(prev => [newToast, ...prev]);
            setTimeout(() => {
                removeToast(newToast.id);
            }, 5000);
        });

        return () => {
            connection.stop();
        };
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(n => n.id !== id));
    };

    const addToast = (message) => {
        const newToast = {
            id: Date.now(),
            message: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setToasts(prev => [newToast, ...prev]);
        setTimeout(() => removeToast(newToast.id), 5000);
    };

    const markAllAsRead = () => {
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    // NEW: Mark specific complaint notifications as read
    const markComplaintAsRead = (complaintId) => {
        setNotifications(prev => {
            const updated = prev.map(n => {
                // Match by explicit ID (if available in future) or parse from string
                const isMatch = (n.complaintId === complaintId) || 
                                (typeof n.message === 'string' && n.message.includes(`#${complaintId}`));
                return isMatch ? { ...n, read: true } : n;
            });
            
            // Recalculate unread count
            setUnreadCount(updated.filter(n => !n.read).length);
            return updated;
        });
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            toasts, 
            unreadCount, 
            addToast, 
            removeToast, 
            markAllAsRead, 
            markComplaintAsRead, // Expose new function
            clearNotifications 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
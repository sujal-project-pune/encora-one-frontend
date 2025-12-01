import React, { useState, useRef, useEffect } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext.jsx';

const NotificationPanel = () => {
    const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const togglePanel = () => {
        if (!isOpen && unreadCount > 0) {
            markAllAsRead();
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Icon Trigger */}
            <button 
                onClick={togglePanel}
                className="relative p-2 text-slate-400 hover:text-violet-500 hover:bg-slate-800/50 rounded-xl transition-all"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        // Opens downwards, anchored to right
                        className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 origin-top-right"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">Notifications</h3>
                            {notifications.length > 0 && (
                                <button 
                                    onClick={clearNotifications}
                                    className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" /> Clear All
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-400">
                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No new notifications</p>
                                </div>
                            ) : (
                                notifications.map((notif, idx) => (
                                    <div 
                                        key={notif.id} 
                                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-violet-50/30' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1">
                                                <div className={`w-2 h-2 rounded-full ${!notif.read ? 'bg-violet-500' : 'bg-slate-300'}`} />
                                            </div>
                                            <div>
                                                <p className={`text-sm text-slate-700 leading-snug ${!notif.read ? 'font-semibold' : ''}`}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1.5">{notif.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationPanel;
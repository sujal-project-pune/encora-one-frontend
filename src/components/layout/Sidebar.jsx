import React, { useState } from 'react';
import { FileText, LayoutDashboard, Briefcase, User, LogOut, X, Mail, BadgeCheck, Briefcase as JobIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. The New Profile Modal Component (JOB TITLE SECTION REMOVED) ---
const ProfileModal = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;

    // Logic to determine the display value for the Department field
    const getDepartmentDisplay = (user) => {
        if (!user || !user.role) {
            return "N/A";
        }
        
        if (user.role === 'Admin') {
            return 'Central Administration';
        }
        if (user.role === 'Manager') {
            return user.department || 'Managerial Role';
        }
        
        return user.department || "Employee Department"; 
    };

    const departmentDisplay = getDepartmentDisplay(user);

    // Animation variants (kept for completeness)
    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
    const modalVariants = { 
        hidden: { opacity: 0, scale: 0.9, y: 20 }, 
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } }, 
        exit: { opacity: 0, scale: 0.95, y: 20 } 
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Modal Card */}
                    <motion.div 
                        className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header with background gradient */}
                        <div className="h-24 bg-gradient-to-r from-violet-600 to-fuchsia-600 relative">
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Avatar & Content */}
                        <div className="px-6 pb-8 -mt-10 relative">
                            {/* Profile Image Circle */}
                            <div className="w-20 h-20 bg-slate-800 rounded-full p-1.5 ring-4 ring-slate-900 mx-auto mb-4 flex items-center justify-center shadow-lg">
                                <div className="w-full h-full bg-slate-700 rounded-full flex items-center justify-center">
                                    <User className="w-10 h-10 text-slate-300" />
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white">{user?.fullName || "User Name"}</h2>
                                <span className="inline-block mt-1 px-3 py-1 bg-violet-500/10 text-violet-400 text-xs font-semibold rounded-full border border-violet-500/20">
                                    {user?.role || "Employee"}
                                </span>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
                                    <div className="p-2 bg-slate-700/50 rounded-lg">
                                        <Mail className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Email Address</p>
                                        <p className="text-slate-200 font-medium">{user?.email || "user@encora.com"}</p>
                                    </div>
                                </div>
                                
                                {/* *** JOB TITLE SECTION REMOVED HERE ***
                                    The conditional block for `user?.role === 'Employee'` 
                                    that displayed Job Title has been removed.
                                */}

                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
                                    <div className="p-2 bg-slate-700/50 rounded-lg">
                                        <BadgeCheck className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Department</p>
                                        <p className="text-slate-200 font-medium">{departmentDisplay}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// --- 2. Main Sidebar Component (Unchanged) ---
const Sidebar = ({ activeTab, setActiveTab, complaintCount }) => {
    const { user, logout } = useAuth();
    
    // State for Modal
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Function to determine the portal text based on role
    const getPortalText = (role) => {
        switch (role) {
            case 'Admin':
                return 'Admin Portal';
            case 'Manager':
                return 'Manager Portal';
            case 'Employee':
            default:
                return 'Employee Portal';
        }
    };
    
    const portalText = getPortalText(user?.role);

    return (
        <>
            <div className="w-72 bg-slate-900 text-white p-6 flex flex-col hidden lg:flex shadow-xl z-20 h-screen sticky top-0 border-r border-slate-800">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/50">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">EncoraOne</h1>
                        <p className="text-xs text-slate-400 font-medium">{portalText}</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <button 
                        onClick={() => setActiveTab('overview')} 
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'overview' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <LayoutDashboard className={`w-5 h-5 ${activeTab === 'overview' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                        <span className="font-medium">Overview</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('complaints')} 
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'complaints' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Briefcase className={`w-5 h-5 ${activeTab === 'complaints' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                        <span className="font-medium">{user?.role === 'Employee' ? "My Grievances" : "Dept Grievances"}</span>
                        {complaintCount > 0 && <span className="ml-auto bg-slate-800 text-xs py-0.5 px-2 rounded-md">{complaintCount}</span>}
                    </button>
                </nav>

                <div className="pt-6 border-t border-slate-800">
                    
                    {/* User Profile Trigger */}
                    <div 
                        className="flex items-center gap-3 mb-4 px-2 p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-700"
                        onClick={() => setIsProfileOpen(true)} // Opens Modal
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 shadow-sm relative">
                            <User className="w-5 h-5 text-slate-300" />
                            {/* Online indicator dot */}
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-800 rounded-full"></span>
                        </div>
                        <div className="overflow-hidden text-left">
                            <p className="text-sm font-semibold truncate text-slate-200">{user?.fullName}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Modal Logic */}
            <ProfileModal 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
                user={user} 
            />
        </>
    );
};

export default Sidebar;
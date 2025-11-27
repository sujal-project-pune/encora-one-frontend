import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, BadgeCheck } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, user }) => {
    
    // 💡 Logic to remove the Dept ID from the display string.
    const getDepartmentDisplay = (user) => {
        if (!user || !user.role) {
            return "N/A";
        }
        
        if (user.role === 'Admin') {
            return 'Central Administration';
        }
        
        if (user.role === 'Manager') {
            return 'Managerial Role';
        }
        
        return 'Employee Department';
    };

    const departmentDisplay = getDepartmentDisplay(user);

    // Animation variants
    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
        exit: { opacity: 0, scale: 0.95, y: 20 }
    };

    // Using Portal to ensure it covers the full screen (z-index fix)
    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
        </AnimatePresence>,
        document.body
    );
};

export default ProfileModal;
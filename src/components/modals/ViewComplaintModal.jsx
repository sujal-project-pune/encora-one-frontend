import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Building2, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ViewComplaintModal = ({ isOpen, onClose, complaint }) => {
    if (!complaint) return null;

    const getStatusColor = (status) => {
        const normalized = status?.replace(/\s/g, '').toLowerCase();
        switch (normalized) {
            case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'inprogress': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        const normalized = status?.replace(/\s/g, '').toLowerCase();
        switch (normalized) {
            case 'pending': return <AlertCircle className="w-4 h-4" />;
            case 'inprogress': return <Loader2 className="w-4 h-4 animate-spin" />;
            case 'resolved': return <CheckCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40" 
                        onClick={onClose} 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                    >
                        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                                        <span className="text-slate-500 font-bold text-sm">#{complaint.complaintId}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">Grievance Details</h3>
                                        <p className="text-xs text-slate-500">Created on {new Date(complaint.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                                
                                {/* Status Banner */}
                                <div className={`flex items-center gap-3 p-3 rounded-xl border ${getStatusColor(complaint.status)}`}>
                                    {getStatusIcon(complaint.status)}
                                    <span className="font-semibold text-sm uppercase tracking-wide">{complaint.status}</span>
                                    {complaint.resolvedAt && (
                                        <span className="text-xs opacity-75 ml-auto">
                                            Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>

                                {/* Employee & Department Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2 text-slate-500">
                                            <User className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">Employee Details</span>
                                        </div>
                                        <p className="font-medium text-slate-800">{complaint.employeeName || "Unknown Employee"}</p>
                                        <p className="text-sm text-slate-500">Requester</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2 text-slate-500">
                                            <Building2 className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase">Department</span>
                                        </div>
                                        <p className="font-medium text-slate-800">{complaint.departmentName || "General"}</p>
                                        <p className="text-sm text-slate-500">Assigned To</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Subject: {complaint.title}</h4>
                                    <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm leading-relaxed">
                                        {complaint.description}
                                    </div>
                                </div>

                                {/* Remarks Section */}
                                {complaint.managerRemarks && (
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="w-full border-t border-slate-200"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-2 bg-white text-xs font-medium text-slate-400 uppercase">Manager Remarks</span>
                                        </div>
                                        <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-slate-700 text-sm italic">
                                            "{complaint.managerRemarks}"
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                                <button 
                                    onClick={onClose}
                                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ViewComplaintModal;
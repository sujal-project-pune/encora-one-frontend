import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import api from '../../api/axios.js';

const CreateComplaintModal = ({ isOpen, onClose, onComplaintCreated }) => {
    const [title, setTitle] = useState('');
    const [dept, setDept] = useState('');
    const [desc, setDesc] = useState('');
    const [departments, setDepartments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            api.get('/Department')
               .then(res => setDepartments(res.data))
               .catch(err => console.error("Failed to load departments", err));
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/Complaint', { 
                title, 
                description: desc, 
                departmentId: parseInt(dept), 
                attachmentUrl: "" 
            });
            onComplaintCreated(); 
            onClose();
            setTitle(''); setDept(''); setDesc('');
        } catch (error) {
            alert("Failed to create complaint: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" 
                        onClick={onClose} 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.95 }} 
                        className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none"
                    >
                        <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800">New Grievance</h3>
                                <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={e => setTitle(e.target.value)} 
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none" 
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
                                    <select 
                                        value={dept} 
                                        onChange={e => setDept(e.target.value)} 
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none" 
                                        required
                                    >
                                        <option value="">Select...</option>
                                        {departments.map(d => (
                                            <option key={d.departmentId} value={d.departmentId}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                                    <textarea 
                                        value={desc} 
                                        onChange={e => setDesc(e.target.value)} 
                                        rows="4" 
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-violet-500/20 outline-none resize-none" 
                                        required 
                                    />
                                </div>

                                <button 
                                    disabled={isSubmitting} 
                                    className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isSubmitting ? "Submitting..." : "Submit Complaint"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CreateComplaintModal;
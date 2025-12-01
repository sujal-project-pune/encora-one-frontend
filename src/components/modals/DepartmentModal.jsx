import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save, Building2 } from 'lucide-react';
import api from '../../api/axios.js';

const DepartmentModal = ({ isOpen, onClose, department, onUpdate }) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(department ? department.name : '');
        }
    }, [isOpen, department]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        setIsSubmitting(true);
        try {
            if (department) {
                // Update
                await api.put('/Department', { 
                    departmentId: department.departmentId, 
                    name 
                });
            } else {
                // Create
                await api.post('/Department', { name });
            }
            onUpdate(); 
            onClose();
        } catch (error) {
            alert("Failed to save: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" 
                        onClick={onClose} 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
                        className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none"
                    >
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl pointer-events-auto flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-violet-600" />
                                    {department ? 'Edit Department' : 'New Department'}
                                </h3>
                                <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Department Name</label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={e => setName(e.target.value)} 
                                        className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" 
                                        placeholder="e.g. Quality Assurance"
                                        required 
                                    />
                                </div>
                                <button disabled={isSubmitting} className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition flex items-center justify-center gap-2 disabled:opacity-70">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Department</>}
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

export default DepartmentModal;
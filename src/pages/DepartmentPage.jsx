import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Edit, Trash2, Search, Loader2, Users, FileText } from 'lucide-react';
import api from '../api/axios.js';
import { useNotification } from '../context/NotificationContext.jsx';
import DepartmentModal from '../components/modals/DepartmentModal.jsx';

const DepartmentPage = () => {
    const { addToast } = useNotification();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Department');
            setDepartments(res.data);
        } catch (error) {
            addToast("Failed to load departments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleEdit = (dept) => {
        setSelectedDept(dept);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedDept(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (dept) => {
        if (!window.confirm(`Delete ${dept.name}? This cannot be undone.`)) return;
        
        try {
            await api.delete(`/Department/${dept.departmentId}`);
            addToast(`Department deleted successfully.`);
            fetchDepartments();
        } catch (error) {
            addToast(`Failed: ${error.response?.data?.message || "Dependencies exist."}`);
        }
    };

    const handleSaveSuccess = () => {
        addToast(selectedDept ? "Department updated!" : "Department created!");
        fetchDepartments();
    };

    const filteredDepartments = departments.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-10">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Departments</h2>
                    <p className="text-slate-500">Manage organizational structure.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-lg shadow-violet-200 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Department
                </button>
            </motion.div>

            {/* Search */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center max-w-md">
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input 
                    type="text" 
                    placeholder="Search departments..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-transparent outline-none text-slate-700 placeholder:text-slate-400" 
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDepartments.map(dept => (
                        <motion.div 
                            key={dept.departmentId}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(dept)} className="p-2 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(dept)} className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-800 mb-4">{dept.name}</h3>
                            
                            <div className="flex gap-4 text-sm text-slate-500 border-t border-slate-50 pt-4">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>{dept.managerCount} Managers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    <span>{dept.complaintCount} Complaints</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    
                    {filteredDepartments.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-400">
                            No departments found.
                        </div>
                    )}
                </div>
            )}

            <DepartmentModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                department={selectedDept}
                onUpdate={handleSaveSuccess}
            />
        </div>
    );
};

export default DepartmentPage;
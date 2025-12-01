import React, { useState, useEffect, useMemo } from 'react';
import { UserPlus, UserCog, UserX, Trash2, Edit, AlertTriangle, CheckCircle, XCircle, Search, Loader2, Users, Mail, Briefcase, Shield, X } from 'lucide-react';
import api from '../api/axios.js';
import { useNotification } from '../context/NotificationContext.jsx';

const ROLE_OPTIONS = [
    { id: 3, name: 'Employee' },
    { id: 2, name: 'Manager' },
    { id: 1, name: 'Admin' }
];

// --- Helper Components ---

const Input = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input
            {...props}
            id={props.name}
            className="w-full bg-white text-slate-800 border border-slate-300 rounded-xl p-3 focus:ring-violet-600 focus:border-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
        />
    </div>
);

const TabButton = ({ icon, label, tabId, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(tabId)}
        className={`flex items-center px-6 py-4 text-base font-semibold transition-colors duration-200 border-b-2 ${
            activeTab === tabId
                ? 'border-violet-600 text-violet-700 bg-violet-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
        }`}
    >
        {icon}
        {label}
    </button>
);

// --- User Detail Card Component ---
const UserDetailCard = ({ user, onClose, onEdit, onDelete, departments }) => {
    if (!user) return null;

    const getRoleName = (id) => ROLE_OPTIONS.find(r => r.id === user.role)?.name || 'Unknown';
    // Match department ID dynamically
    const getDeptName = (id) => departments.find(d => d.departmentId === id)?.name || 'N/A';

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="h-24 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-1 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="px-8 pb-8">
                <div className="relative -mt-10 mb-4 flex justify-between items-end">
                    <div className="w-20 h-20 bg-white rounded-full p-1.5 shadow-md">
                        <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-400">
                            {user.fullName?.charAt(0)}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(user)} className="px-4 py-2 bg-violet-100 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-200 transition-colors flex items-center gap-2">
                            <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => onDelete(user)} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800">{user.fullName}</h3>
                <p className="text-slate-500 mb-6">{user.email}</p>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1">
                            <Shield className="w-3 h-3" /> Role
                        </div>
                        <p className="font-medium text-slate-700">{getRoleName(user.role)}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1">
                            <Briefcase className="w-3 h-3" /> Job Title
                        </div>
                        <p className="font-medium text-slate-700">{user.jobTitle || 'N/A'}</p>
                    </div>
                    {user.role === 2 && (
                        <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1">
                                <Users className="w-3 h-3" /> Department
                            </div>
                            <p className="font-medium text-slate-700">{getDeptName(user.departmentId)}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Inline Form Component ---
const UserForm = ({ onSubmit, submitButtonText, formData, handleChange, activeTab, departments }) => {
    const isManagerRole = String(formData.role) === '2';
    const isPasswordRequired = activeTab === 'add';

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
                <Input type="text" name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} required />
                <Input type="email" name="email" label="Email" value={formData.email} onChange={handleChange} required />
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-xl p-3 focus:border-violet-600 outline-none">
                            {ROLE_OPTIONS.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
                        </select>
                    </div>
                    {isManagerRole && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                            <select id="departmentId" name="departmentId" value={formData.departmentId} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-xl p-3 focus:border-violet-600 outline-none" required>
                                <option value="">Select...</option>
                                {/* DYNAMIC DEPARTMENTS */}
                                {departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.name}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <Input type="text" name="jobTitle" label="Job Title" value={formData.jobTitle} onChange={handleChange} required />
                
                <div className="border-t border-slate-100 pt-2">
                    <Input 
                        type="password" 
                        name="password" 
                        label={isPasswordRequired ? "Password" : "New Password (Optional)"} 
                        value={formData.password} 
                        onChange={handleChange} 
                        required={isPasswordRequired} 
                    />
                </div>
            </div>
           
            <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-violet-200 mt-4">
                {submitButtonText}
            </button>
        </form>
    );
};

// --- Main Admin Page ---
const AdminPage = () => {
    const { addToast } = useNotification(); 
    
    const [activeTab, setActiveTab] = useState('all_users');
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
    
    // Data State
    const [allUsers, setAllUsers] = useState([]);
    const [departments, setDepartments] = useState([]); // Store fetched departments
    const [loadingUsers, setLoadingUsers] = useState(false);
    
    // Selection State
    const [selectedUser, setSelectedUser] = useState(null);
    
    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '', role: '3', departmentId: '', jobTitle: ''
    });

    // 1. Fetch All Users & Departments on Mount
    const fetchData = async () => {
        setLoadingUsers(true);
        try {
            // Fetch Users
            const usersRes = await api.get('/Admin/users');
            setAllUsers(usersRes.data);

            // Fetch Departments
            const deptRes = await api.get('/Department');
            setDepartments(deptRes.data);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            addToast("Error fetching data. Ensure backend is running.");
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Computed Suggestions
    const suggestions = useMemo(() => {
        if (!searchQuery) return [];
        return allUsers.filter(u => 
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
            u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
    }, [searchQuery, allUsers]);

    // Handlers
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchQuery('');
        setShowSuggestions(false);
        setFormData({
            id: user.id,
            fullName: user.fullName || '',
            email: user.email || '',
            password: '',
            role: user.role?.toString(),
            departmentId: user.departmentId?.toString() || '',
            jobTitle: user.jobTitle || ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'role' && value !== '2') newState.departmentId = '';
            return newState;
        });
    };

    const displayStatus = (message, type) => {
        setStatusMessage({ message, type });
        setTimeout(() => setStatusMessage({ message: '', type: '' }), 5000);
    };

    // --- API Actions ---

    const handleRegister = async (e) => {
        e.preventDefault();
        let parsedDeptId = null;
        if (formData.role === '2' && formData.departmentId) parsedDeptId = parseInt(formData.departmentId, 10);

        if (formData.role === '2' && !parsedDeptId) {
            addToast('Error: Manager requires Department');
            return;
        }

        try {
            await api.post('/Auth/register', { ...formData, role: parseInt(formData.role), departmentId: parsedDeptId });
            addToast(`User ${formData.fullName} registered!`);
            displayStatus('User registered successfully!', 'success');
            setFormData({ fullName: '', email: '', password: '', role: '3', departmentId: '', jobTitle: '' });
            fetchData(); // Refresh list
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Registration failed';
            displayStatus(`Registration failed: ${msg}`, 'error');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        let parsedDeptId = null;
        if (formData.role === '2' && formData.departmentId) parsedDeptId = parseInt(formData.departmentId, 10);

        try {
            const payload = {
                ...formData,
                id: selectedUser.id,
                role: parseInt(formData.role),
                departmentId: parsedDeptId,
                password: formData.password || undefined
            };
            
            await api.put('/Admin/user', payload);
            addToast(`User updated!`);
            displayStatus('User updated successfully!', 'success');
            fetchData(); // Refresh list
            
            const updatedUser = { ...selectedUser, ...payload };
            setSelectedUser(updatedUser);
        } catch (error) {
            displayStatus(`Update failed: ${error.response?.data?.message}`, 'error');
        }
    };

    const handleDelete = async (userToDelete) => {
        if(!window.confirm(`Delete ${userToDelete.fullName}?`)) return;
        try {
            await api.delete(`/Admin/user/${userToDelete.id}`);
            addToast(`User deleted.`);
            setSelectedUser(null);
            fetchData();
        } catch (error) {
            addToast(`Deletion failed`);
        }
    };

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen text-slate-800 font-inter rounded-xl">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-2 text-slate-900 tracking-tight">User Management Hub</h1>
                <p className="text-slate-600 mb-8">Manage employees, managers, and system administrators.</p>
               
                {statusMessage.message && (
                    <div className={`p-4 border mb-6 text-sm font-semibold flex items-center ${statusMessage.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} rounded-xl`}>
                        {statusMessage.message}
                    </div>
                )}

                <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
                    <TabButton icon={<Users className="w-5 h-5 mr-3" />} label="All Users" tabId="all_users" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton icon={<UserPlus className="w-5 h-5 mr-3" />} label="Add New" tabId="add" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton icon={<UserCog className="w-5 h-5 mr-3" />} label="Update" tabId="update" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Search & Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        <div className="relative bg-white p-2 rounded-2xl shadow-sm border border-slate-100 z-20">
                            <div className="flex items-center px-4">
                                <Search className="w-5 h-5 text-slate-400 mr-3" />
                                <input 
                                    type="text" 
                                    placeholder="Search by name or email..." 
                                    className="w-full py-3 bg-transparent outline-none text-slate-700"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                {loadingUsers && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                            </div>

                            {showSuggestions && searchQuery && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                                    {suggestions.map(u => (
                                        <div 
                                            key={u.id} 
                                            onClick={() => handleSelectUser(u)}
                                            className="px-4 py-3 hover:bg-violet-50 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-0"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">{u.fullName}</p>
                                                <p className="text-xs text-slate-400">{u.email}</p>
                                            </div>
                                            <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500">
                                                {ROLE_OPTIONS.find(r => r.id === u.role)?.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
                            {activeTab === 'all_users' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Directory ({allUsers.length})</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {allUsers.map(user => (
                                            <div 
                                                key={user.id} 
                                                onClick={() => handleSelectUser(user)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedUser?.id === user.id ? 'border-violet-500 bg-violet-50' : 'border-slate-100 hover:border-violet-200 hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                                        {user.fullName[0]}
                                                    </div>
                                                    <span className="text-xs px-2 py-1 bg-white rounded border border-slate-200 text-slate-500">
                                                        {ROLE_OPTIONS.find(r => r.id === user.role)?.name}
                                                    </span>
                                                </div>
                                                <p className="font-semibold text-slate-800 truncate">{user.fullName}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'add' && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-6">Create New User</h3>
                                    <UserForm 
                                        onSubmit={handleRegister} 
                                        submitButtonText="Register User" 
                                        formData={formData} 
                                        handleChange={handleChange} 
                                        activeTab="add"
                                        departments={departments} // Pass fetched departments
                                    />
                                </div>
                            )}

                            {activeTab === 'update' && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-6">Update User Details</h3>
                                    {selectedUser ? (
                                        <UserForm 
                                            onSubmit={handleUpdate} 
                                            submitButtonText="Update User" 
                                            formData={formData} 
                                            handleChange={handleChange} 
                                            activeTab="update"
                                            departments={departments} // Pass fetched departments
                                        />
                                    ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>Use the search bar or select a user from the list to edit.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            {selectedUser ? (
                                <UserDetailCard 
                                    user={selectedUser} 
                                    onClose={() => setSelectedUser(null)} 
                                    onEdit={(u) => { handleSelectUser(u); setActiveTab('update'); }}
                                    onDelete={handleDelete}
                                    departments={departments} // Pass fetched departments
                                />
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center text-slate-400">
                                    <UserCog className="w-12 h-12 mb-4 opacity-30" />
                                    <p className="text-sm font-medium">Select a user to view details</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminPage;
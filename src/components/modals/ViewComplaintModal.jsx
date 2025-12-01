import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building2, Clock, CheckCircle, AlertCircle, Loader2, RotateCcw, MessageSquare, Send, FileText } from 'lucide-react';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const ViewComplaintModal = ({ isOpen, onClose, complaint }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('details'); // Default to details
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Fetch comments when switching to discussion tab
    useEffect(() => {
        if (isOpen && complaint && activeTab === 'discussion') {
            fetchComments();
        }
    }, [isOpen, complaint, activeTab]);

    // Scroll to bottom on new message
    useEffect(() => {
        if (activeTab === 'discussion') {
            scrollToBottom();
        }
    }, [comments, activeTab]);

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            const res = await api.get(`/Comment/complaint/${complaint.complaintId}`);
            setComments(res.data);
        } catch (error) {
            console.error("Failed to load comments");
        } finally {
            setLoadingComments(false);
        }
    };

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSending(true);
        try {
            const res = await api.post('/Comment', {
                complaintId: complaint.complaintId,
                text: newComment
            });
            setComments([...comments, res.data]);
            setNewComment('');
        } catch (error) {
            console.error("Failed to send comment");
        } finally {
            setSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!complaint && !isOpen) return null;

    const getStatusColor = (status) => {
        const normalized = status?.replace(/\s/g, '').toLowerCase();
        switch (normalized) {
            case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'inprogress': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'returned': return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        const normalized = status?.replace(/\s/g, '').toLowerCase();
        switch (normalized) {
            case 'pending': return <AlertCircle className="w-4 h-4" />;
            case 'inprogress': return <Loader2 className="w-4 h-4 animate-spin" />;
            case 'returned': return <RotateCcw className="w-4 h-4" />;
            case 'resolved': return <CheckCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && complaint && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" 
                        onClick={onClose} 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                        className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none"
                    >
                        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
                            
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                                        <span className="text-slate-500 font-bold text-sm">#{complaint.complaintId}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">Grievance Details</h3>
                                        <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full w-fit mt-1 ${getStatusColor(complaint.status)}`}>
                                            {getStatusIcon(complaint.status)}
                                            <span className="uppercase tracking-wide">{complaint.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="flex border-b border-slate-200 px-6">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'details' 
                                            ? 'border-violet-600 text-violet-700' 
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <FileText className="w-4 h-4" /> Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('discussion')}
                                    className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'discussion' 
                                            ? 'border-violet-600 text-violet-700' 
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <MessageSquare className="w-4 h-4" /> Discussion
                                </button>
                            </div>

                            {/* Tab Content Area */}
                            <div className="flex-1 overflow-hidden bg-slate-50/50">
                                
                                {/* 1. DETAILS TAB */}
                                {activeTab === 'details' && (
                                    <div className="p-6 overflow-y-auto h-full custom-scrollbar space-y-6">
                                        {/* Employee & Department Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2 text-slate-400">
                                                    <User className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Requester</span>
                                                </div>
                                                <p className="font-semibold text-slate-800">{complaint.employeeName || "Unknown"}</p>
                                                <p className="text-xs text-slate-500">Created: {new Date(complaint.createdAt).toLocaleDateString()}</p>
                                            </div>

                                            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2 text-slate-400">
                                                    <Building2 className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Department</span>
                                                </div>
                                                <p className="font-semibold text-slate-800">{complaint.departmentName || "General"}</p>
                                                <p className="text-xs text-slate-500">Assigned To</p>
                                            </div>
                                        </div>

                                        {/* Subject & Description */}
                                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                            <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide border-b border-slate-100 pb-2">Subject: {complaint.title}</h4>
                                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                                {complaint.description}
                                            </p>
                                        </div>

                                        {/* Official Remarks */}
                                        {complaint.managerRemarks && (
                                            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                                                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" /> Manager Resolution Note
                                                </h4>
                                                <p className="text-blue-800 text-sm italic">
                                                    "{complaint.managerRemarks}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 2. DISCUSSION TAB */}
                                {activeTab === 'discussion' && (
                                    <div className="flex flex-col h-full">
                                        {/* Messages Area */}
                                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-100/50">
                                            {loadingComments ? (
                                                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>
                                            ) : comments.length === 0 ? (
                                                <div className="text-center py-10 text-slate-400">
                                                    <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                                    <p className="text-sm">No comments yet. Start the conversation.</p>
                                                </div>
                                            ) : (
                                                comments.map((c) => {
                                                    const isMe = c.userId === user?.id;
                                                    const isManager = c.userRole === 'Manager' || c.userRole === 'Admin';
                                                    
                                                    return (
                                                        <div key={c.commentId} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                            <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm text-sm ${
                                                                isMe 
                                                                    ? 'bg-violet-600 text-white rounded-br-none' 
                                                                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                                                            }`}>
                                                                <div className={`flex items-center gap-2 mb-1 text-xs ${isMe ? 'text-violet-200' : 'text-slate-400'}`}>
                                                                    <span className="font-bold">{isMe ? 'You' : c.userName}</span>
                                                                    {!isMe && isManager && (
                                                                        <span className="bg-blue-100 text-blue-600 px-1.5 rounded text-[10px] font-bold">STAFF</span>
                                                                    )}
                                                                </div>
                                                                <p className="leading-relaxed whitespace-pre-wrap">{c.text}</p>
                                                                <p className={`text-[10px] mt-2 text-right ${isMe ? 'text-violet-200' : 'text-slate-400'}`}>
                                                                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Input Area */}
                                        <div className="p-3 bg-white border-t border-slate-200">
                                            <form onSubmit={handleSendComment} className="flex items-end gap-2">
                                                <textarea
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Type a message..."
                                                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none max-h-32 min-h-[44px]"
                                                    rows="1"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSendComment(e);
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    type="submit" 
                                                    disabled={!newComment.trim() || sending}
                                                    className="p-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                                >
                                                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ViewComplaintModal;
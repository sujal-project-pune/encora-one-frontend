import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx'; // NEW
import ResetPassword from './pages/ResetPassword.jsx'; // NEW
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import NotificationToast from './components/ui/NotificationToast.jsx';
import AdminPage from './pages/AdminPage.jsx';

const ProtectedRoute = ({ children, roleRequired }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    
    if (roleRequired && !['Manager', 'Admin'].includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }
    
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router>
                    <NotificationToast />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        
                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/admin" element={<ProtectedRoute roleRequired={true}><AdminPage /></ProtectedRoute>} />
                            <Route path="/reports" element={<ProtectedRoute roleRequired={true}><Reports /></ProtectedRoute>} />
                        </Route>
                        
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
};

export default App;
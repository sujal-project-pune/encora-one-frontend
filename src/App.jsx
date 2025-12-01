import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import NotificationToast from './components/ui/NotificationToast.jsx';
import AdminPage from './pages/AdminPage.jsx';
import DepartmentPage from './pages/DepartmentPage.jsx'; // NEW Import

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
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        
                        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            
                            <Route path="/reports" element={<ProtectedRoute roleRequired={true}><Reports /></ProtectedRoute>} />
                            
                            <Route path="/admin" element={<ProtectedRoute roleRequired={true}><AdminPage /></ProtectedRoute>} />
                            
                            {/* NEW: Departments Route */}
                            <Route path="/departments" element={<ProtectedRoute roleRequired={true}><DepartmentPage /></ProtectedRoute>} />
                        </Route>
                        
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
};

export default App;
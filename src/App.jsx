import React, { Component } from 'react';
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
import DepartmentPage from './pages/DepartmentPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AboutPage from './pages/AboutPage.jsx'; // NEW Import
import GlassNavbar from './components/ui/GlassNavbar.jsx';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught Error in Component:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-8">
                    <div className="max-w-md bg-red-800/20 border border-red-700/50 p-6 rounded-xl text-center">
                        <h1 className="text-3xl font-bold text-red-400 mb-4">Application Error</h1>
                        <button 
                            onClick={() => window.location.reload()}
                            className="text-white bg-red-600 hover:bg-red-700 font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children; 
    }
}

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
    const HomeRoute = useAuth()?.user ? <Navigate to="/dashboard" /> : <LandingPage />;

    return (
        <AuthProvider>
            <NotificationProvider>
                <Router>
                    <NotificationToast />
                    <Routes>
                        <Route path="/" element={
                            <ErrorBoundary>
                                <>
                                    <GlassNavbar />
                                    <LandingPage />
                                </>
                            </ErrorBoundary>
                        } />

                        {/* NEW: About Route */}
                        <Route path="/about" element={
                            <ErrorBoundary>
                                <AboutPage />
                            </ErrorBoundary>
                        } />
                        
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        
                        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/reports" element={<ProtectedRoute roleRequired={true}><Reports /></ProtectedRoute>} />
                            <Route path="/admin" element={<ProtectedRoute roleRequired={true}><AdminPage /></ProtectedRoute>} />
                            <Route path="/departments" element={<ProtectedRoute roleRequired={true}><DepartmentPage /></ProtectedRoute>} />
                        </Route>

                        <Route path="/home" element={<ErrorBoundary>{HomeRoute}</ErrorBoundary>} />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
};

export default App;
//comment
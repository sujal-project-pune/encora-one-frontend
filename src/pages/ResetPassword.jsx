import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, KeyRound, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import AuthLayout from '../components/layout/AuthLayout';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email;

    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!emailFromState) {
            navigate('/forgot-password');
        }
    }, [emailFromState, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post('/Auth/reset-password', {
                email: emailFromState,
                otp: otp,
                newPassword: password
            });
            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password. OTP may be invalid.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!emailFromState) return null;

    return (
        <AuthLayout
            title="Set New Password"
            subtitle={isSuccess ? "Success!" : `Enter OTP sent to ${emailFromState}`}
        >
            {isSuccess ? (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-emerald-700/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Password Changed</h3>
                    <p className="text-slate-300 mb-8">Your account has been secured with a new password.</p>
                    <Link 
                        to="/login" 
                        className="inline-flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02]"
                    >
                        Continue to Login <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 flex items-center gap-3 text-red-300 text-sm font-medium">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Enter OTP</label>
                        <div className="relative group">
                            <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-violet-400" />
                            <input 
                                type="text" 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all tracking-[0.5em] text-center font-mono font-bold text-lg placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-500"
                                placeholder="6-Digit Code"
                                maxLength={6}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-violet-400" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-violet-400" />
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        disabled={isSubmitting} 
                        type="submit" 
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 hover:scale-[1.02]"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ResetPassword;
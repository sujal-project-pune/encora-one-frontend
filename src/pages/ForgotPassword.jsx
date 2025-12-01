import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import emailjs from '@emailjs/browser';
import AuthLayout from '../components/layout/AuthLayout';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await api.post('/Auth/forgot-password', { email });
            const otp = response.data.token;

            const templateParams = {
                to_email: email,
                otp_code: otp,
                message: "Here is your One-Time Password (OTP) to reset your account access.",
            };
            await emailjs.send(
                'service_t9dusjc',  // Replace with your Service ID
                'template_nrq43tl', // Replace with your Template ID
                templateParams, 
                'KGF2e296803-07r4r'   // Replace with your Public Key
            );

            navigate('/reset-password', { state: { email: email } });

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to send OTP. Please check the email.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout 
            title="Reset Password" 
            subtitle="Enter your email to receive a verification code."
        >
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-6 flex items-center gap-3 text-red-300 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all font-medium"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                </div>

                <button 
                    disabled={isSubmitting} 
                    type="submit" 
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
                </button>

                <div className="text-center">
                    <Link to="/login" className="text-slate-400 hover:text-violet-400 text-sm transition-colors font-medium flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { Mail, Lock, ShieldAlert, ArrowRight, GraduationCap, Briefcase } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('STUDENT'); // 'STUDENT' or 'FACULTY'

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Redirect to requested page, or respective dashboard by default
  const from = location.state?.from?.pathname || '';

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    reset(); // Clear form inputs on tab switch
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await login(data.email, data.password);

    if (result.success) {
      // Role enforcement check
      if (activeTab === 'STUDENT' && result.role !== 'STUDENT') {
        logout();
        setSubmitting(false);
        toast.error('Access Denied: Please use the Faculty tab to login as a Faculty member.');
        return;
      }
      
      if (activeTab === 'FACULTY' && result.role !== 'FACULTY') {
        logout();
        setSubmitting(false);
        toast.error('Access Denied: This account is not registered as Faculty.');
        return;
      }

      setSubmitting(false);
      toast.success(result.message || 'Login successful!');
      
      // Determine redirection path based on role and requested path
      setTimeout(() => {
        if (from && from.toLowerCase().includes(result.role.toLowerCase())) {
          navigate(from, { replace: true });
        } else {
          if (result.role === 'FACULTY') {
            navigate('/faculty/dashboard', { replace: true });
          } else {
            navigate('/student/dashboard', { replace: true });
          }
        }
      }, 800);
    } else {
      setSubmitting(false);
      toast.error(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-tr from-slate-100 via-white to-blue-50/30">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 text-white mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome to CMS
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            College Complaint Management System
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/60 shadow-inner">
          <button
            type="button"
            onClick={() => handleTabChange('STUDENT')}
            className={`w-1/2 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'STUDENT'
                ? 'bg-white text-primary shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Student Portal
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('FACULTY')}
            className={`w-1/2 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'FACULTY'
                ? 'bg-white text-secondary shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Faculty Portal
          </button>
        </div>

        {/* Card Form */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-100/50">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              {activeTab === 'STUDENT' ? 'Student Sign In' : 'Faculty Sign In'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'STUDENT' 
                ? 'Log in to raise complaints and check status' 
                : 'Access to review, assign, and update reported issues'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`block w-full rounded-lg border py-2.5 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200/20' 
                      : 'border-slate-200 focus:border-primary focus:ring-primary/20'
                  }`}
                  placeholder={activeTab === 'STUDENT' ? 'student@campus.edu' : 'faculty@campus.edu'}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`block w-full rounded-lg border py-2.5 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200/20' 
                      : 'border-slate-200 focus:border-primary focus:ring-primary/20'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="group relative flex w-full justify-center items-center gap-2 rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary/40 active:bg-blue-700 disabled:opacity-75 transition-all shadow-md shadow-primary/10 cursor-pointer"
              >
                {submitting ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom links */}
          {activeTab === 'STUDENT' && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                New student?{' '}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                  Create a student account
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

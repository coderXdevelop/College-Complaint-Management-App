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
    <div className="flex min-h-screen bg-slate-950 font-sans transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Left panel: Decorative / Info - Hidden on mobile, shown on lg/xl */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-800 via-primary-900 to-secondary-950 text-white p-12 flex-col justify-between overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-primary-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-500/15 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
            <ShieldAlert className="h-5 w-5 text-primary-300" />
          </div>
          <span className="font-extrabold text-lg tracking-wider uppercase bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
            CMS Portal
          </span>
        </div>

        <div className="relative z-10 max-w-lg my-auto space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-primary-200 bg-clip-text text-transparent">
            Resolve grievances. <br />
            Elevate campus life.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Connect directly with faculty administration, track complaint resolutions in real-time, and voice infrastructure concerns to help build a better campus environment.
          </p>
          
          <div className="pt-4 space-y-3">
            {[
              'Submit issues with photos and precise locations',
              'Receive instant email and portal notifications',
              'Interact with feedback scores and status updates',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-medium text-slate-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-4">
          <span>Secure Student & Faculty Login</span>
          <span>© {new Date().getFullYear()} Campus Grievance Redressal</span>
        </div>
      </div>

      {/* Right panel: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12 sm:px-12 bg-gradient-to-tr from-slate-100 via-white to-primary-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-primary-950/10 relative transition-colors duration-300">
        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          {/* Brand Header (Visible on Mobile only) */}
          <div className="flex flex-col items-center lg:items-start lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white mb-4 shadow-lg shadow-primary/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome to CMS
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              College Complaint Management System
            </p>
          </div>

          {/* Tab Selectors */}
          <div className="rounded-2xl bg-slate-200/60 dark:bg-slate-900/60 p-1 border border-slate-300/40 dark:border-slate-800/40 shadow-inner flex">
            <button
              type="button"
              id="tab-student"
              onClick={() => handleTabChange('STUDENT')}
              className={`w-1/2 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'STUDENT'
                  ? 'bg-white dark:bg-slate-800 text-primary dark:text-primary-400 shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Student Portal
            </button>
            <button
              type="button"
              id="tab-faculty"
              onClick={() => handleTabChange('FACULTY')}
              className={`w-1/2 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'FACULTY'
                  ? 'bg-white dark:bg-slate-800 text-secondary dark:text-slate-200 shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Faculty Portal
            </button>
          </div>

          {/* Card Form */}
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/30">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'STUDENT' ? 'Student Sign In' : 'Faculty Sign In'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activeTab === 'STUDENT' 
                  ? 'Log in to raise complaints and check status' 
                  : 'Access to review, assign, and update reported issues'}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Email address
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
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
                    className={`block w-full rounded-xl border py-3 pl-10 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm bg-white dark:bg-slate-950 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200/20' 
                        : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-primary/10'
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
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
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
                    className={`block w-full rounded-xl border py-3 pl-10 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm bg-white dark:bg-slate-950 ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200/20' 
                        : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-primary/10'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="login-submit"
                  disabled={submitting}
                  className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-primary hover:bg-primary-600 active:bg-primary-700 py-3 px-4 text-sm font-semibold text-white transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
                >
                  {submitting ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom links */}
            {activeTab === 'STUDENT' && (
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  New student?{' '}
                  <Link to="/register" id="link-to-register" className="font-bold text-primary dark:text-primary-400 hover:underline hover:text-primary-700 dark:hover:text-primary-300">
                    Create a student account
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

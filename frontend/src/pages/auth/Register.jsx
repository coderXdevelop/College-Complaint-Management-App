import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { User, Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await registerUser(data.name, data.email, data.password);
    setSubmitting(false);

    if (result.success) {
      toast.success(result.message || 'Registration successful!');
      setTimeout(() => {
        navigate('/student/dashboard', { replace: true });
      }, 800);
    } else {
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
            Create an Account. <br />
            Report problems quickly.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Register as a student in just a few seconds to submit campus issues, add photos of broken fixtures, and keep track of resolutions provided by university administrators.
          </p>
          
          <div className="pt-4 space-y-3">
            {[
              'Direct access to student dashboards',
              'Quick forms with drag-and-drop attachment uploads',
              'Real-time remark updates from resolving faculty',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-medium text-slate-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-4">
          <span>Student Portal Registration</span>
          <span>© {new Date().getFullYear()} Campus Grievance Redressal</span>
        </div>
      </div>

      {/* Right panel: Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12 sm:px-12 bg-gradient-to-tr from-slate-100 via-white to-primary-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-primary-950/10 relative overflow-y-auto transition-colors duration-300">
        <div className="w-full max-w-md space-y-8 animate-fadeIn my-auto py-8">
          {/* Brand Header (Visible on Mobile only) */}
          <div className="flex flex-col items-center lg:items-start lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white mb-4 shadow-lg shadow-primary/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create an account
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Join the student grievance portal
            </p>
          </div>

          {/* Card Form */}
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/30">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Student Sign Up
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your details to create a student profile
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    {...register('name', { required: 'Full name is required' })}
                    className={`block w-full rounded-xl border py-2.5 pl-10 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm bg-white dark:bg-slate-950 ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200/20' 
                        : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-primary/10'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.name.message}</p>
                )}
              </div>

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
                    className={`block w-full rounded-xl border py-2.5 pl-10 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm bg-white dark:bg-slate-950 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200/20' 
                        : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-primary/10'
                    }`}
                    placeholder="john.doe@university.edu"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>
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
                    autoComplete="new-password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className={`block w-full rounded-xl border py-2.5 pl-10 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm bg-white dark:bg-slate-950 ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200/20' 
                        : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-primary/10'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match'
                    })}
                    className={`block w-full rounded-xl border py-2.5 pl-10 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm bg-white dark:bg-slate-950 ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200/20' 
                        : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-primary/10'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  id="register-submit"
                  disabled={submitting}
                  className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-primary hover:bg-primary-600 active:bg-primary-700 py-3 px-4 text-sm font-semibold text-white transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
                >
                  {submitting ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  ) : (
                    <>
                      Create Student Account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Already registered?{' '}
                <Link to="/login" id="link-to-login" className="font-bold text-primary dark:text-primary-400 hover:underline hover:text-primary-700 dark:hover:text-primary-300">
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

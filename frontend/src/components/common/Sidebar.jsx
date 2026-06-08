import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext.jsx';
import { 
  LayoutDashboard, 
  FilePlus, 
  ClipboardList, 
  LogOut, 
  ShieldAlert,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { role, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/create', label: 'Create Complaint', icon: FilePlus },
    { to: '/student/complaints', label: 'My Complaints', icon: ClipboardList },
  ];

  const facultyLinks = [
    { to: '/faculty/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/faculty/complaints', label: 'All Complaints', icon: ClipboardList },
  ];

  const links = role === 'FACULTY' ? facultyLinks : studentLinks;

  const getEmailDisplay = () => {
    if (user?.sub) return user.sub;
    if (user?.email) return user.email;
    return role === 'FACULTY' ? 'faculty@campus.edu' : 'student@campus.edu';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-all duration-300 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-gradient-to-b from-secondary to-slate-950 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-900 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand/Logo Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-900 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-base tracking-widest uppercase bg-gradient-to-r from-white via-slate-100 to-primary-100 bg-clip-text text-transparent">
              CMS Portal
            </span>
          </div>
          <button 
            onClick={toggleSidebar} 
            id="sidebar-close-btn"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors lg:hidden active:scale-95"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* User Info Card */}
        <div className="p-5 border-b border-slate-900 bg-slate-950/20">
          <div className="flex items-center gap-3.5 bg-slate-900/30 rounded-2xl p-4 border border-slate-900 backdrop-blur-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-extrabold shadow-lg shadow-primary/20 uppercase">
              {user?.name ? user.name.substring(0, 2) : role === 'FACULTY' ? 'FA' : 'ST'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-white truncate leading-snug">{user?.name || (role === 'FACULTY' ? 'Faculty Member' : 'Student')}</h4>
              <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{getEmailDisplay()}</p>
              <span className="mt-2 inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary border border-slate-700/50">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 relative group overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg shadow-primary/25 border-l-4 border-white'
                      : 'text-slate-400 hover:bg-slate-900/50 hover:text-white border-l-4 border-transparent'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105" />
                {link.label}
              </NavLink>
            );
          })}
          
          <button
            onClick={toggleTheme}
            id="sidebar-theme-toggle"
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-900/50 hover:text-white border-l-4 border-transparent transition-all duration-300 active:scale-[0.98] cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-slate-400" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/20">
          <button
            onClick={handleLogout}
            id="logout-btn"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-danger/10 hover:text-danger border-l-4 border-transparent hover:border-danger transition-all active:scale-[0.98] cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

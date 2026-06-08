import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Check, CheckCheck, Inbox, Loader2, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext.jsx';
import API from '../../api/axios';

const Navbar = ({ toggleSidebar }) => {
  const { role, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const countRes = await API.get('/api/notifications/my/unread-count');
      setUnreadCount(countRes.data.unread || 0);

      const listRes = await API.get('/api/notifications/my');
      setNotifications(listRes.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(true);

    // Poll for notifications every 15 seconds
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleNotificationClick = async (notif) => {
    // Mark as read if unread
    if (!notif.readFlag) {
      try {
        await API.put(`/api/notifications/${notif.id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, readFlag: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (err) {
        console.error('Error marking read on click:', err);
      }
    }

    // Parse complaint ID from the message (e.g. "complaint #123")
    const match = notif.message.match(/#(\d+)/);
    if (match && match[1]) {
      const complaintId = match[1];
      setDropdownOpen(false);
      if (role === 'FACULTY') {
        navigate(`/faculty/complaints/${complaintId}`);
      } else {
        navigate(`/student/complaints/${complaintId}`);
      }
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await API.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readFlag: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, readFlag: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-secondary-100 dark:border-secondary-800 bg-white/70 dark:bg-background/70 backdrop-blur-md px-6 transition-all duration-300">
      {/* Left: Mobile Sidebar Trigger & Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          id="mobile-sidebar-toggle"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors active:scale-95 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {role === 'FACULTY' ? 'Faculty Panel' : 'Student Portal'}
          </h2>
          <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {getGreeting()}, <span className="text-primary dark:text-primary-400 font-extrabold">{user?.name || (role === 'FACULTY' ? 'Professor' : 'Student')}</span>
          </h1>
        </div>
      </div>

      {/* Right: Theme Toggler, Notifications & Quick Profile */}
      <div className="flex items-center gap-4">
        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          id="navbar-theme-toggle"
          className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-all active:scale-95 cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notification Bell with Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            id="notification-bell-btn"
            className={`relative rounded-xl p-2.5 transition-all ${
              dropdownOpen 
                ? 'bg-primary-50 dark:bg-primary-950/40 text-primary dark:text-primary-400' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
            <Bell className="h-4.5 w-4.5" />
          </button>

          {/* Premium Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-secondary shadow-2xl border border-secondary-200/50 dark:border-secondary-800 z-50 overflow-hidden py-1 animate-scaleUp origin-top-right">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-secondary-100 dark:border-secondary-800 px-4 py-3 bg-secondary-50/70 dark:bg-secondary/70">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Notifications ({unreadCount} unread)
                </span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 cursor-pointer transition-colors"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List Wrapper */}
              <div className="max-h-72 overflow-y-auto divide-y divide-secondary-50 dark:divide-secondary-800">
                {loading && notifications.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <Inbox className="h-8 w-8 text-secondary-300 dark:text-secondary-700 mb-2" />
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Inbox is empty</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">You'll see alerts here when tickets change state</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`flex flex-col gap-1 p-3.5 text-left transition-colors cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-800/50 ${
                        !notif.readFlag ? 'bg-primary-50/20 dark:bg-primary-950/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className={`text-xs leading-relaxed ${!notif.readFlag ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                          {notif.message}
                        </p>
                        {!notif.readFlag && (
                          <button
                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300 shrink-0 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-secondary-100 dark:bg-secondary-800"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{user?.name || (role === 'FACULTY' ? 'Faculty Admin' : 'Student User')}</p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">IP: Campus Network</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 uppercase">
            {user?.name ? user.name.substring(0, 2) : role === 'FACULTY' ? 'FA' : 'ST'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Check, CheckCheck, Inbox, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const Navbar = ({ toggleSidebar }) => {
  const { role, user } = useAuth();
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md">
      {/* Left: Mobile Sidebar Trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            {role === 'FACULTY' ? 'Faculty Portal' : 'Student Portal'}
          </h2>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            {getGreeting()}, {user?.name || (role === 'FACULTY' ? 'Professor' : 'Student')}
          </h1>
        </div>
      </div>

      {/* Right: Notifications & Quick Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell with Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
            <Bell className="h-5 w-5" />
          </button>

          {/* Premium Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-slate-200/60 z-50 overflow-hidden py-1 animate-fadeIn origin-top-right">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/40">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Notifications ({unreadCount} unread)
                </span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:text-primary-700 cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List Wrapper */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {loading && notifications.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <Inbox className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-500">Inbox is empty</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">You'll see alerts here when tickets change state</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`flex flex-col gap-1 p-3.5 text-left transition-colors cursor-pointer hover:bg-slate-50/80 ${
                        !notif.readFlag ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className={`text-xs leading-normal ${!notif.readFlag ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                          {notif.message}
                        </p>
                        {!notif.readFlag && (
                          <button
                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                            className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 shrink-0"
                            title="Mark as read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-800">{user?.name || (role === 'FACULTY' ? 'Faculty Admin' : 'Student User')}</p>
            <p className="text-xs text-slate-400 font-medium">IP: Campus Network</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

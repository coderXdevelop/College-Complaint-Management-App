import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { role, user } = useAuth();

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
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
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <Bell className="h-5 w-5" />
        </button>
        
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

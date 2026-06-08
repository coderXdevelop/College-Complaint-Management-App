import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import { Search, Filter, Calendar, MapPin, Inbox, Loader2 } from 'lucide-react';

const MyComplaints = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST'); // 'NEWEST' or 'OLDEST'

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await API.get('/api/complaints/my');
        setComplaints(response.data || []);
      } catch (error) {
        console.error('Error fetching student complaints list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Filter & Search Logic
  const filteredComplaints = complaints
    .filter((complaint) => {
      const matchesSearch = 
        complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'ALL' || 
        complaint.status?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortBy === 'NEWEST' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl tracking-tight">My Complaints</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review the status and details of your reported issues</p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm transition-colors duration-300">
        {/* Search */}
        <div className="relative w-full md:max-w-xs rounded-xl shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            id="complaints-search"
            placeholder="Search by title, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 pl-9 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-950 transition-all text-sm"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5" />
            <select
              value={statusFilter}
              id="status-filter"
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent dark:bg-slate-950 font-bold focus:outline-none cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option value="ALL" className="dark:bg-slate-950 dark:text-white">All Status</option>
              <option value="PENDING" className="dark:bg-slate-950 dark:text-white">Pending</option>
              <option value="IN_PROGRESS" className="dark:bg-slate-950 dark:text-white">In Progress</option>
              <option value="RESOLVED" className="dark:bg-slate-950 dark:text-white">Resolved</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
            <Calendar className="h-3.5 w-3.5" />
            <select
              value={sortBy}
              id="sort-filter"
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent dark:bg-slate-950 font-bold focus:outline-none cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option value="NEWEST" className="dark:bg-slate-950 dark:text-white">Newest First</option>
              <option value="OLDEST" className="dark:bg-slate-950 dark:text-white">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Complaints List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 text-center">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 text-slate-400 dark:text-slate-650 mb-4 border border-slate-100 dark:border-slate-800/80 shadow-inner">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No complaints found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            Try adjusting your search criteria or status filters, or file a new complaint.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 uppercase tracking-widest">
                    ID: #{complaint.id}
                  </span>
                  <StatusBadge status={complaint.status} />
                </div>
                
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-400 transition-colors line-clamp-1 text-base">
                  {complaint.title}
                </h3>
                
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2rem] leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                {/* Meta details */}
                <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate font-semibold">{complaint.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="font-semibold">{complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => navigate(`/student/complaints/${complaint.id}`)}
                  className="w-full inline-flex items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-all active:scale-[0.98] cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;

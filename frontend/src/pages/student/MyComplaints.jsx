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
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">My Complaints</h1>
        <p className="text-sm text-slate-500 mt-1">Review the status and details of your reported issues</p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-xs rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600">
            <Filter className="h-3.5 w-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600">
            <Calendar className="h-3.5 w-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Complaints List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 bg-white rounded-xl border border-slate-200/60">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-sm font-medium text-slate-500">Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-slate-200/60 text-center">
          <div className="rounded-full bg-slate-50 p-4 text-slate-400 mb-4 border border-slate-100">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No complaints found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Try adjusting your search criteria or status filters, or file a new complaint.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm hover:shadow-md transition-all hover:border-slate-300"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase">
                    ID: #{complaint.id}
                  </span>
                  <StatusBadge status={complaint.status} />
                </div>
                
                <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                  {complaint.title}
                </h3>
                
                <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 min-h-[2rem]">
                  {complaint.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                {/* Meta details */}
                <div className="flex flex-col gap-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{complaint.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => navigate(`/student/complaints/${complaint.id}`)}
                  className="w-full inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-[0.98]"
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

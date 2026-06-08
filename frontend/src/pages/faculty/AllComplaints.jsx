import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import { toast, ToastContainer } from 'react-toastify';
import { Search, Filter, Eye, Edit, X, RefreshCw, Loader2, Inbox } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const AllComplaints = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusInput, setStatusInput] = useState('');
  const [remarksInput, setRemarksInput] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  const fetchComplaints = async (page = 0) => {
    setLoading(true);
    try {
      const response = await API.get(`/api/faculty/complaints?page=${page}&size=${pageSize}`);
      const pageData = response.data;
      if (pageData && Array.isArray(pageData.content)) {
        setComplaints(pageData.content);
        setTotalPages(pageData.totalPages || 0);
        setCurrentPage(page);
      } else {
        setComplaints(Array.isArray(pageData) ? pageData : []);
        setTotalPages(0);
        setCurrentPage(0);
      }
    } catch (error) {
      console.error('Error fetching faculty complaints:', error);
      toast.error('Failed to fetch complaints.');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(0);
  }, []);

  const openUpdateModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusInput(complaint.status || 'PENDING');
    setRemarksInput(complaint.remarks || '');
    setModalOpen(true);
  };

  const closeUpdateModal = () => {
    setModalOpen(false);
    setSelectedComplaint(null);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setModalSubmitting(true);
    try {
      // First update status and remarks via PUT /api/faculty/complaints/{id}/status
      // Note: The backend DTO might contain remarks directly in the request or just status.
      // Typically, status updates take remarks along with them. Let's send a combined body:
      const payload = {
        status: statusInput,
        remarks: remarksInput
      };
      
      const response = await API.put(`/api/faculty/complaints/${selectedComplaint.id}/status`, payload);
      
      toast.success(response.data.message || 'Complaint updated successfully!');
      
      // Update local state instead of full reload for snappy UI
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === selectedComplaint.id
            ? { ...c, status: statusInput, remarks: remarksInput, updatedAt: new Date().toISOString() }
            : c
        )
      );
      
      closeUpdateModal();
    } catch (error) {
      console.error('Error updating complaint status:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update complaint status.';
      toast.error(errorMsg);
    } finally {
      setModalSubmitting(false);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const studentName = c.studentName || '';
    const title = c.title || '';
    const location = c.location || '';
    
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || c.status?.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Grievance Management</h1>
          <p className="text-sm text-slate-500 mt-1">Review, assign, and update reported campus incidents</p>
        </div>
        <button
          onClick={() => fetchComplaints(0)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
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
            placeholder="Search student, title, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
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
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-24">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-500">Retrieving campus complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="rounded-full bg-slate-50 p-4 text-slate-400 mb-4 border border-slate-100">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No complaints match criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Currently there are no reported incidents matching the chosen status or query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Complaint Title</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-500 text-xs whitespace-nowrap">
                      #{c.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                      {c.studentName || 'Anonymous Student'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-950 block truncate max-w-xs sm:max-w-md">
                        {c.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap truncate max-w-[150px]">
                      {c.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap text-xs">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Action */}
                        <button
                          onClick={() => navigate(`/faculty/complaints/${c.id}`)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        {/* Update Status Action */}
                        <button
                          onClick={() => openUpdateModal(c)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-all active:scale-95"
                          title="Update Status"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => fetchComplaints(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    type="button"
                    className="relative inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchComplaints(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    type="button"
                    className="relative ml-3 inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">
                      Showing page <span className="font-semibold text-slate-900">{currentPage + 1}</span> of{' '}
                      <span className="font-semibold text-slate-900">{totalPages}</span> pages
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => fetchComplaints(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        type="button"
                        className="relative inline-flex items-center rounded-l-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 focus:z-20 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => fetchComplaints(idx)}
                          type="button"
                          className={`relative inline-flex items-center px-4 py-2 text-xs font-semibold border-t border-b focus:z-20 ${
                            currentPage === idx
                              ? 'z-10 bg-primary border-primary text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => fetchComplaints(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage === totalPages - 1}
                        type="button"
                        className="relative inline-flex items-center rounded-r-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 focus:z-20 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Update Status Overlay Modal */}
      {modalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200/50 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Update Status</h3>
                <p className="text-xs text-slate-400 mt-0.5">Editing Ticket #{selectedComplaint.id}</p>
              </div>
              <button
                onClick={closeUpdateModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Complaint Status
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold cursor-pointer bg-white"
                >
                  <option value="PENDING">PENDING (Yellow)</option>
                  <option value="IN_PROGRESS">IN PROGRESS (Blue)</option>
                  <option value="RESOLVED">RESOLVED (Green)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Remarks / Actions Taken
                </label>
                <textarea
                  rows={4}
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  placeholder="Enter remarks for the student (e.g. Electrician scheduled for room 203...)"
                  className="block w-full rounded-lg border border-slate-200 py-2 px-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  required
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-75"
                >
                  {modalSubmitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  ) : (
                    'Update Ticket'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllComplaints;

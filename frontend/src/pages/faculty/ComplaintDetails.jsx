import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import { toast, ToastContainer } from 'react-toastify';
import { ArrowLeft, MapPin, Calendar, User, MessageSquare, AlertTriangle, FileImage, Save, CheckCircle } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const FacultyComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Status edit states
  const [statusInput, setStatusInput] = useState('');
  const [remarksInput, setRemarksInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await API.get(`/api/complaints/${id}`);
        setComplaint(response.data);
        setStatusInput(response.data.status || 'PENDING');
        setRemarksInput(response.data.remarks || '');
      } catch (error) {
        console.error('Error fetching faculty complaint details:', error);
        setError('Complaint details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        status: statusInput,
        remarks: remarksInput
      };
      
      const response = await API.put(`/api/faculty/complaints/${id}/status`, payload);
      toast.success(response.data.message || 'Status updated successfully!');
      
      setComplaint((prev) => ({
        ...prev,
        status: statusInput,
        remarks: remarksInput,
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error updating status on details page:', error);
      toast.error(error.response?.data?.message || 'Failed to update complaint status.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Error Loading Details</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error || 'Complaint not found.'}</p>
        <button
          onClick={() => navigate('/faculty/complaints')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-primary-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Back button */}
      <Link
        to="/faculty/complaints"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all complaints
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Main Details card */}
        <div className="lg:col-span-2 overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-100/40 dark:shadow-slate-950/30">
          {/* Title Panel */}
          <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  Ticket ID: #{complaint.id}
                </span>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white md:text-2xl mt-2 tracking-tight">{complaint.title}</h1>
              </div>
              <StatusBadge status={complaint.status} />
            </div>
          </div>

          {/* Content Panel */}
          <div className="p-6 md:p-8 space-y-8">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Description</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">{complaint.description}</p>
            </div>

            {complaint.imageUrl && (
              <div className="space-y-3.5">
                <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <FileImage className="h-4 w-4" />
                  Attachment
                </h4>
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg bg-slate-50 dark:bg-slate-950">
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint attachment"
                    className="w-full object-cover max-h-80 hover:scale-102 transition-all duration-300 cursor-zoom-in"
                    onClick={() => window.open(complaint.imageUrl, '_blank')}
                  />
                </div>
              </div>
            )}

            {/* Current Remarks Panel */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/20 p-5">
              <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                <MessageSquare className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                Current Faculty Remarks
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-350 font-bold italic leading-relaxed">
                {complaint.remarks || 'No remarks added yet for this ticket.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Action Panel + Meta details */}
        <div className="space-y-6">
          {/* Action Update Card */}
          <div className="rounded-3xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-250 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-primary dark:text-primary-400" />
              Manage Ticket
            </h3>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Change Status
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary text-sm font-semibold cursor-pointer bg-white dark:bg-slate-955"
                >
                  <option value="PENDING" className="dark:bg-slate-950">PENDING</option>
                  <option value="IN_PROGRESS" className="dark:bg-slate-950">IN PROGRESS</option>
                  <option value="RESOLVED" className="dark:bg-slate-950">RESOLVED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Remarks / Actions Taken
                </label>
                <textarea
                  rows={4}
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  placeholder="Enter notes on progress..."
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 py-3 px-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-950 text-sm font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                id="btn-save-updates"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none cursor-pointer shadow-lg shadow-primary/25"
              >
                {submitting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Updates
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Meta details Card */}
          <div className="rounded-3xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Meta Details</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 shrink-0">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Location</p>
                  <p className="text-slate-800 dark:text-white text-sm font-bold mt-1.5">{complaint.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 shrink-0">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Reporter Student</p>
                  <p className="text-slate-800 dark:text-white text-sm font-bold mt-1.5">{complaint.studentName || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 shrink-0">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Submitted On</p>
                  <p className="text-slate-800 dark:text-white text-sm font-bold mt-1.5">
                    {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {complaint.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 shrink-0">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Last Action Date</p>
                    <p className="text-slate-800 dark:text-white text-sm font-bold mt-1.5">
                      {new Date(complaint.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyComplaintDetails;

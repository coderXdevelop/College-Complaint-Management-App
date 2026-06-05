import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import { ArrowLeft, MapPin, Calendar, User, MessageSquare, AlertTriangle, FileImage } from 'lucide-react';

const StudentComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await API.get(`/api/complaints/${id}`);
        setComplaint(response.data);
      } catch (error) {
        console.error('Error fetching complaint details:', error);
        setError('Complaint not found or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id]);

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
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Error Loading Details</h2>
        <p className="text-sm text-slate-500">{error || 'Complaint not found.'}</p>
        <button
          onClick={() => navigate('/student/complaints')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Back button */}
      <Link
        to="/student/complaints"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to list
      </Link>

      {/* Main card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
        {/* Title Panel */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
                Ticket ID: #{complaint.id}
              </span>
              <h1 className="text-xl font-bold text-slate-900 md:text-2xl mt-2">{complaint.title}</h1>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Content Panel */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left / Info & Description */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
            </div>

            {/* Remarks Section */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-4">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                Faculty Remarks
              </h4>
              <p className="text-sm text-slate-600 italic">
                {complaint.remarks || 'No remarks provided yet by the reviewing faculty.'}
              </p>
            </div>
          </div>

          {/* Right / Meta Info & Media */}
          <div className="lg:col-span-2 space-y-6 lg:border-l lg:border-slate-100 lg:pl-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Meta Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-700">Location</p>
                  <p className="text-slate-500 text-xs mt-0.5">{complaint.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <User className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-700">Reporter</p>
                  <p className="text-slate-500 text-xs mt-0.5">{complaint.studentName || 'Self'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-700">Submitted On</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700">Last Updated</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {new Date(complaint.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Complaint Image */}
            {complaint.imageUrl && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <FileImage className="h-4 w-4" />
                  Attachment
                </h4>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint attachment"
                    className="w-full object-cover max-h-48 hover:scale-105 transition-all duration-300 cursor-zoom-in"
                    onClick={() => window.open(complaint.imageUrl, '_blank')}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentComplaintDetails;

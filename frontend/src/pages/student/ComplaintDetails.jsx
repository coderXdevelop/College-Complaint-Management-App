import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import { toast, ToastContainer } from 'react-toastify';
import { ArrowLeft, MapPin, Calendar, User, MessageSquare, AlertTriangle, FileImage, Star, Loader2 } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const StudentComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Feedback states
  const [feedback, setFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await API.get(`/api/complaints/${id}`);
        const comp = response.data;
        setComplaint(comp);

        if (comp.status === 'RESOLVED') {
          setLoadingFeedback(true);
          try {
            const fbResponse = await API.get(`/api/feedback/complaint/${id}`);
            setFeedback(fbResponse.data);
            if (fbResponse.data && fbResponse.data.status === 'SUBMITTED') {
              setRating(fbResponse.data.rating || 5);
              setComments(fbResponse.data.comments || '');
            }
          } catch (fbError) {
            console.error('Error fetching feedback:', fbError);
          } finally {
            setLoadingFeedback(false);
          }
        }
      } catch (error) {
        console.error('Error fetching complaint details:', error);
        setError('Complaint not found or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const payload = {
        rating: Number(rating),
        comments: comments
      };
      const response = await API.post(`/api/feedback/complaint/${id}`, payload);
      setFeedback(response.data);
      toast.success('Feedback submitted successfully!');
    } catch (fbSubmitError) {
      console.error('Error submitting feedback:', fbSubmitError);
      toast.error(fbSubmitError.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const renderStars = (count, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={interactive ? () => setRating(star) : undefined}
            className={`transition-all ${
              interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
            }`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= count ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'
              }`}
            />
          </button>
        ))}
      </div>
    );
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
      <ToastContainer position="top-right" autoClose={3000} />
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

            {/* Feedback Section */}
            {complaint.status === 'RESOLVED' && (
              <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">Resolved Ticket Feedback</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Let us know how we resolved your request</p>
                </div>

                {loadingFeedback ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  </div>
                ) : feedback && feedback.status === 'SUBMITTED' ? (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">Your Rating:</span>
                      {renderStars(feedback.rating)}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block mb-1">Your Comments:</span>
                      <p className="text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 italic">
                        {feedback.comments || 'No comments provided.'}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Submitted on {feedback.updatedAt ? new Date(feedback.updatedAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Select Rating:
                      </label>
                      {renderStars(rating, true)}
                    </div>

                    <div>
                      <label htmlFor="comments" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Comments / Suggestions
                      </label>
                      <textarea
                        id="comments"
                        rows={3}
                        maxLength={2000}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Provide details about your experience (e.g. prompt resolution, satisfied with the work...)"
                        className="block w-full rounded-lg border border-slate-200 py-2 px-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                      <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-medium">
                        <span>Max 2000 characters</span>
                        <span>{comments.length}/2000</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 text-xs font-semibold transition-all active:scale-95 disabled:opacity-75"
                    >
                      {submittingFeedback ? (
                        <Loader2 className="h-4 w-4 animate-spin animate-spin-slow" />
                      ) : (
                        'Submit Feedback'
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
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

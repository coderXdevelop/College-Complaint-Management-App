import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  ClipboardList, 
  Clock, 
  RotateCw, 
  CheckCircle,
  Plus,
  ArrowRight,
  Inbox
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await API.get('/api/complaints/my');
        const data = response.data || [];
        setComplaints(data);
        
        // Calculate statistics locally from complaints list
        const calculatedStats = data.reduce((acc, curr) => {
          acc.total += 1;
          const status = curr.status?.toUpperCase();
          if (status === 'PENDING') acc.pending += 1;
          else if (status === 'IN_PROGRESS') acc.inProgress += 1;
          else if (status === 'RESOLVED') acc.resolved += 1;
          return acc;
        }, { total: 0, pending: 0, inProgress: 0, resolved: 0 });

        setStats(calculatedStats);
      } catch (error) {
        console.error('Error fetching student complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const statCards = [
    {
      label: 'Total Complaints',
      value: stats.total,
      icon: ClipboardList,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: RotateCw,
      color: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'bg-emerald-500/10 text-emerald-600',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage your campus grievances</p>
        </div>
        <Link
          to="/student/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-all shadow-md shadow-primary/10"
        >
          <Plus className="h-4 w-4" />
          File New Complaint
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{card.label}</p>
                  {loading ? (
                    <div className="mt-2 h-8 w-16 animate-pulse rounded bg-slate-200" />
                  ) : (
                    <h3 className="mt-1 text-3xl font-bold text-slate-900">{card.value}</h3>
                  )}
                </div>
                <div className={`rounded-xl p-3 ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Complaints Table section */}
      <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Complaints</h2>
            <p className="text-xs text-slate-500 mt-0.5">Your most recently submitted tickets</p>
          </div>
          <Link
            to="/student/complaints"
            className="group flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-700 transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center justify-between py-2 animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-48 rounded bg-slate-200" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
                <div className="h-6 w-20 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-slate-50 p-4 text-slate-400 mb-4 border border-slate-100">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No complaints raised yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              If you have any campus infrastructure issues, click the file button above to log them.
            </p>
            <Link
              to="/student/create"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Raise your first complaint
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.slice(0, 5).map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900 max-w-xs sm:max-w-md truncate">
                          {complaint.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs sm:max-w-md">
                          {complaint.location}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/student/complaints/${complaint.id}`)}
                        className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.98]"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

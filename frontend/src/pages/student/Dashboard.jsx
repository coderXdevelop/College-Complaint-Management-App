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
      color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: RotateCw,
      color: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl tracking-tight">Student Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage your campus grievances</p>
        </div>
        <Link
          to="/student/create"
          id="btn-file-complaint"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-600 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 cursor-pointer"
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
              className="relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{card.label}</p>
                  {loading ? (
                    <div className="mt-2.5 h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  ) : (
                    <h3 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{card.value}</h3>
                  )}
                </div>
                <div className={`rounded-xl p-3 shadow-inner ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Complaints Table section */}
      <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Recent Complaints</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Your most recently submitted tickets</p>
          </div>
          <Link
            to="/student/complaints"
            className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center justify-between py-2 animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-850" />
                  <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-900" />
                </div>
                <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 text-slate-400 dark:text-slate-600 mb-4 border border-slate-100 dark:border-slate-800 shadow-inner">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No complaints raised yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
              If you have any campus infrastructure issues, click the file button above to log them.
            </p>
            <Link
              to="/student/create"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-primary-400 hover:underline hover:text-primary-700 dark:hover:text-primary-300"
            >
              Raise your first complaint
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold text-[10px] uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {complaints.slice(0, 5).map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/40 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white max-w-xs sm:max-w-md truncate text-sm">
                          {complaint.title}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate max-w-xs sm:max-w-md flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                          {complaint.location}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs font-medium">
                      {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/student/complaints/${complaint.id}`)}
                        className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-850 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 hover:text-slate-900 dark:hover:text-white transition-all active:scale-[0.98] cursor-pointer"
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

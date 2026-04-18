import React, { useEffect } from 'react';
import { Mail, Calendar, CheckSquare, ListTodo, TrendingUp, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import AppLayout from '../components/Layout/AppLayout';
import Header from '../components/Layout/Header';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { stats, fetchTasks } = useTasks();

  useEffect(() => { fetchTasks(); }, []);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const completionPct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statRows = [
    { label: 'Total Tasks',   value: stats.total,      icon: ListTodo,     color: 'text-brand-400'   },
    { label: 'Completed',     value: stats.completed,  icon: CheckSquare,  color: 'text-emerald-400' },
    { label: 'In Progress',   value: stats.inProgress, icon: TrendingUp,   color: 'text-amber-400'   },
    { label: 'High Priority', value: stats.high,       icon: Flame,        color: 'text-rose-400'    },
  ];

  return (
    <AppLayout>
      <Header title="Profile" subtitle="Your account & task statistics" />

      <div className="max-w-2xl">
        {/* Avatar card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mb-6 flex sm:flex-row flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center text-4xl font-bold text-white shadow-glow flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-slate-400 flex items-center gap-2 justify-center sm:justify-start mt-1">
              <Mail size={14} /> {user?.email}
            </p>
            <p className="text-slate-500 flex items-center gap-2 justify-center sm:justify-start mt-1 text-sm">
              <Calendar size={13} /> Member since {joinDate}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-400">{completionPct}%</div>
            <div className="text-xs text-slate-500 mt-1">Completion rate</div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-6">
          <h3 className="section-title mb-5">Task Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            {statRows.map(({ label, value, icon: Icon, color }, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl">
                <Icon size={20} className={color} />
                <div>
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress */}
        {stats.total > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="section-title mb-4">Progress Overview</h3>
            <div className="space-y-4">
              {[
                { label: 'Completed',   value: stats.completed,  total: stats.total, color: 'bg-emerald-500' },
                { label: 'In Progress', value: stats.inProgress, total: stats.total, color: 'bg-amber-500'   },
                { label: 'Pending',     value: stats.pending,    total: stats.total, color: 'bg-slate-500'   },
              ].map(({ label, value, total, color }) => {
                const pct = total ? Math.round((value / total) * 100) : 0;
                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-white font-medium">{value} <span className="text-slate-500">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                      <motion.div className={`h-full ${color} rounded-full`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;

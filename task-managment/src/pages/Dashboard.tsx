import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare, Clock, AlertTriangle, ListTodo,
  TrendingUp, Plus, ArrowRight, Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import AppLayout from '../components/Layout/AppLayout';
import Header from '../components/Layout/Header';
import StatsCard from '../components/UI/StatsCard';
import TaskCard from '../components/UI/TaskCard';
import TaskModal from '../components/UI/TaskModal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import type { Task, TaskFormData } from '../types';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks, stats, isLoading, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editTask, setEditTask] = React.useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Task | null>(null);

  useEffect(() => { fetchTasks(); }, []);

  const recentTasks = tasks.slice(0, 6);

  const handleSubmit = async (data: TaskFormData) => {
    if (editTask) await updateTask(editTask._id, data);
    else await createTask(data);
    fetchTasks();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteTask(deleteTarget._id);
    setDeleteTarget(null);
    fetchTasks();
  };

  const handleStatusChange = async (task: Task, status: Task['status']) => {
    await updateTask(task._id, { status });
    fetchTasks();
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completionPct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <AppLayout>
      <Header
        title={`${greeting()}, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here's what's on your plate today"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Tasks"   value={stats.total}      icon={ListTodo}      color="brand"   index={0} />
        <StatsCard label="Completed"     value={stats.completed}  icon={CheckSquare}   color="emerald" index={1} />
        <StatsCard label="In Progress"   value={stats.inProgress} icon={TrendingUp}    color="amber"   index={2} />
        <StatsCard label="High Priority" value={stats.high}       icon={Flame}         color="rose"    index={3} />
      </div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="glass-card p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-white">Overall Progress</p>
              <p className="text-xs text-slate-500 mt-0.5">{stats.completed} of {stats.total} tasks completed</p>
            </div>
            <span className="text-2xl font-bold text-brand-400">{completionPct}%</span>
          </div>
          <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
              initial={{ width: 0 }} animate={{ width: `${completionPct}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}

      {/* Stats row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Pending"  value={stats.pending} icon={Clock}          color="slate"  index={4} />
        <StatsCard label="Overdue"  value={stats.overdue} icon={AlertTriangle}  color="rose"   index={5} />
      </div>

      {/* Recent Tasks */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Recent Tasks</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => { setEditTask(null); setModalOpen(true); }} id="dashboard-add-task" className="btn-primary">
            <Plus size={16} /> New Task
          </button>
          <button onClick={() => navigate('/tasks')} className="btn-secondary">
            View All <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><LoadingSpinner /></div>
      ) : recentTasks.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-600/15 flex items-center justify-center mx-auto mb-4">
            <ListTodo size={28} className="text-brand-400" />
          </div>
          <p className="text-white font-semibold mb-1">No tasks yet!</p>
          <p className="text-slate-400 text-sm mb-6">Create your first task to get started.</p>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Create Task
          </button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {recentTasks.map((task) => (
            <TaskCard
              key={task._id} task={task}
              onEdit={(t) => { setEditTask(t); setModalOpen(true); }}
              onDelete={(t) => setDeleteTarget(t)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <TaskModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditTask(null); }} onSubmit={handleSubmit} editTask={editTask} />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppLayout>
  );
};

export default Dashboard;

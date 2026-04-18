import React, { useEffect, useState, useCallback } from 'react';
import { Plus, ListTodo, LayoutGrid, List } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import AppLayout from '../components/Layout/AppLayout';
import Header from '../components/Layout/Header';
import TaskCard from '../components/UI/TaskCard';
import FilterBar from '../components/UI/FilterBar';
import TaskModal from '../components/UI/TaskModal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import type { Task, TaskFormData } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

const Tasks: React.FC = () => {
  const { tasks, stats, isLoading, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const load = useCallback(() => {
    fetchTasks({ status, priority, search, sortBy });
  }, [status, priority, search, sortBy, fetchTasks]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleSubmit = async (data: TaskFormData) => {
    if (editTask) await updateTask(editTask._id, data);
    else await createTask(data);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteTask(deleteTarget._id);
    setDeleteTarget(null);
    load();
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    await updateTask(task._id, { status: newStatus });
    load();
  };

  const clearFilters = () => { setSearch(''); setStatus('all'); setPriority('all'); setSortBy('createdAt'); };

  return (
    <AppLayout>
      <Header title="My Tasks" subtitle={`${stats.total} tasks total`} />

      {/* Filter bar */}
      <FilterBar
        search={search} status={status} priority={priority} sortBy={sortBy}
        onSearchChange={setSearch} onStatusChange={setStatus}
        onPriorityChange={setPriority} onSortChange={setSortBy} onClear={clearFilters}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-400">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
        </p>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-dark-800 border border-dark-600/60 rounded-xl p-1">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-600/30 text-brand-300' : 'text-slate-500 hover:text-white'}`} aria-label="Grid view">
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand-600/30 text-brand-300' : 'text-slate-500 hover:text-white'}`} aria-label="List view">
              <List size={16} />
            </button>
          </div>
          <button onClick={() => { setEditTask(null); setModalOpen(true); }} id="tasks-add-btn" className="btn-primary">
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Tasks */}
      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : tasks.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-600/15 flex items-center justify-center mx-auto mb-4">
            <ListTodo size={28} className="text-brand-400" />
          </div>
          <p className="text-white font-semibold mb-1">No tasks found</p>
          <p className="text-slate-400 text-sm mb-6">
            {search || status !== 'all' || priority !== 'all' ? 'Try adjusting your filters' : 'Create your first task to get started'}
          </p>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Create Task
          </button>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
            {tasks.map((task) => (
              <TaskCard
                key={task._id} task={task}
                onEdit={(t) => { setEditTask(t); setModalOpen(true); }}
                onDelete={(t) => setDeleteTarget(t)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <TaskModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditTask(null); }} onSubmit={handleSubmit} editTask={editTask} />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete Task"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppLayout>
  );
};

export default Tasks;

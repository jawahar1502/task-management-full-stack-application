import React from 'react';
import { Calendar, Edit2, Trash2, Circle } from 'lucide-react';
import type { Task } from '../../types';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: Task['status']) => void;
}

const statusConfig = {
  pending:     { label: 'Pending',     cls: 'badge-pending',     dot: 'bg-slate-400' },
  'in-progress':{ label: 'In Progress', cls: 'badge-in-progress', dot: 'bg-amber-400' },
  completed:   { label: 'Completed',   cls: 'badge-completed',   dot: 'bg-emerald-400' },
};

const priorityConfig = {
  low:    { label: 'Low',    cls: 'badge-low',    bar: 'bg-slate-500' },
  medium: { label: 'Medium', cls: 'badge-medium', bar: 'bg-blue-500'  },
  high:   { label: 'High',   cls: 'badge-high',   bar: 'bg-rose-500'  },
};

const nextStatus: Record<Task['status'], Task['status']> = {
  pending: 'in-progress',
  'in-progress': 'completed',
  completed: 'pending',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const status  = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const formatDate = (d: string | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`glass-card p-5 flex flex-col gap-3 group hover:border-brand-700/40 transition-all duration-300 ${
        task.status === 'completed' ? 'opacity-75' : ''
      }`}
    >
      {/* Priority bar */}
      <div className={`h-0.5 w-16 rounded-full ${priority.bar} opacity-70`} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={() => onStatusChange(task, nextStatus[task.status])}
          className="mt-0.5 flex-shrink-0 text-slate-500 hover:text-brand-400 transition-colors"
          title="Cycle status"
          aria-label="Toggle task status"
        >
          <Circle
            size={18}
            className={task.status === 'completed' ? 'fill-emerald-500 text-emerald-500' : ''}
          />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm leading-snug ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="btn-icon" aria-label="Edit task">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(task)} className="btn-icon text-rose-400 hover:text-rose-300 hover:bg-rose-500/10" aria-label="Delete task">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={status.cls}><span className={`w-1.5 h-1.5 rounded-full inline-block ${status.dot}`} /> {status.label}</span>
          <span className={priority.cls}>{priority.label}</span>
        </div>
        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-rose-400' : 'text-slate-500'}`}>
            <Calendar size={12} />
            <span>{formatDate(task.dueDate)}</span>
            {isOverdue && <span className="font-semibold">(Overdue)</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;

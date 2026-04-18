import React, { useEffect, useRef, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Task, TaskFormData } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  editTask?: Task | null;
}

const defaultForm: TaskFormData = {
  title: '', description: '', status: 'pending', priority: 'medium', dueDate: '',
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, editTask }) => {
  const [form, setForm] = useState<TaskFormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [loading, setLoading] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(
        editTask
          ? {
              title: editTask.title,
              description: editTask.description,
              status: editTask.status,
              priority: editTask.priority,
              dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
            }
          : defaultForm
      );
      setErrors({});
      setTimeout(() => firstRef.current?.focus(), 100);
    }
  }, [isOpen, editTask]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    else if (form.title.length > 100) newErrors.title = 'Max 100 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
    onClose();
  };

  const update = (field: keyof TaskFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-lg glass-card p-6 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="modal-title" className="text-lg font-bold text-white">
                {editTask ? '✏️ Edit Task' : '✨ Create New Task'}
              </h2>
              <button onClick={onClose} className="btn-icon" aria-label="Close modal"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {/* Title */}
              <div>
                <label className="input-label" htmlFor="task-title">Title *</label>
                <input
                  ref={firstRef}
                  id="task-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="Enter task title…"
                  className={`input-field ${errors.title ? 'border-rose-500 focus:border-rose-500' : ''}`}
                  maxLength={100}
                />
                {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="input-label" htmlFor="task-desc">Description</label>
                <textarea
                  id="task-desc"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Add details (optional)…"
                  rows={3}
                  maxLength={500}
                  className="input-field resize-none"
                />
              </div>

              {/* Status + Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label" htmlFor="task-status">Status</label>
                  <select id="task-status" value={form.status} onChange={(e) => update('status', e.target.value)} className="input-field cursor-pointer">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="input-label" htmlFor="task-priority">Priority</label>
                  <select id="task-priority" value={form.priority} onChange={(e) => update('priority', e.target.value)} className="input-field cursor-pointer">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="input-label" htmlFor="task-due">Due Date</label>
                <input
                  id="task-due"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => update('dueDate', e.target.value)}
                  className="input-field"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center" id="modal-submit">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? 'Saving…' : editTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;

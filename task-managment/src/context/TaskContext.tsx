import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Task, TaskStats, TaskFormData } from '../types';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';

interface TaskState {
  tasks: Task[];
  stats: TaskStats;
  isLoading: boolean;
  error: string | null;
}

interface TaskContextType extends TaskState {
  fetchTasks: (params?: object) => Promise<void>;
  createTask: (data: TaskFormData) => Promise<boolean>;
  updateTask: (id: string, data: Partial<TaskFormData>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
}

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TASKS'; payload: { tasks: Task[]; stats: TaskStats } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_ERROR'; payload: string };

const defaultStats: TaskStats = {
  total: 0, completed: 0, inProgress: 0, pending: 0, high: 0, overdue: 0,
};

const initialState: TaskState = {
  tasks: [],
  stats: defaultStats,
  isLoading: false,
  error: null,
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload.tasks, stats: action.payload.stats, isLoading: false, error: null };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t._id !== action.payload) };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async (params?: object) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await taskAPI.getTasks(params);
      dispatch({ type: 'SET_TASKS', payload: { tasks: res.data.tasks, stats: res.data.stats } });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Failed to fetch tasks' });
    }
  }, []);

  const createTask = useCallback(async (data: TaskFormData): Promise<boolean> => {
    try {
      const res = await taskAPI.createTask(data);
      dispatch({ type: 'ADD_TASK', payload: res.data.task });
      toast.success('Task created! ✅');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      return false;
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<TaskFormData>): Promise<boolean> => {
    try {
      const res = await taskAPI.updateTask(id, data);
      dispatch({ type: 'UPDATE_TASK', payload: res.data.task });
      toast.success('Task updated! ✏️');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      return false;
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      await taskAPI.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      toast.success('Task deleted! 🗑️');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
      return false;
    }
  }, []);

  return (
    <TaskContext.Provider value={{ ...state, fetchTasks, createTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};

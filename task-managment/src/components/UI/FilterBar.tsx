import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  search: string;
  status: string;
  priority: string;
  sortBy: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
  onSortChange: (v: string) => void;
  onClear: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search, status, priority, sortBy,
  onSearchChange, onStatusChange, onPriorityChange, onSortChange, onClear
}) => {
  const hasFilters = search || status !== 'all' || priority !== 'all';

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks…"
          id="task-search"
          className="input-field pl-10"
        />
        {search && (
          <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        id="filter-status"
        className="input-field w-full sm:w-36 cursor-pointer"
        aria-label="Filter by status"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Priority */}
      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        id="filter-priority"
        className="input-field w-full sm:w-36 cursor-pointer"
        aria-label="Filter by priority"
      >
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        id="filter-sort"
        className="input-field w-full sm:w-40 cursor-pointer"
        aria-label="Sort tasks"
      >
        <option value="createdAt">Newest First</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="title">Title A–Z</option>
      </select>

      {/* Clear */}
      {hasFilters && (
        <button onClick={onClear} className="btn-secondary whitespace-nowrap" id="filter-clear">
          <SlidersHorizontal size={15} /> Clear
        </button>
      )}
    </div>
  );
};

export default FilterBar;

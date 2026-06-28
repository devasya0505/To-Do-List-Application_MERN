// Status options
export const STATUSES = [
  { value: 'pending', label: 'Pending', icon: '⏳', color: 'var(--status-pending)' },
  { value: 'in-progress', label: 'In Progress', icon: '🔄', color: 'var(--status-progress)' },
  { value: 'completed', label: 'Completed', icon: '✅', color: 'var(--status-completed)' },
];

// Priority options
export const PRIORITIES = [
  { value: 'low', label: 'Low', icon: '🟢', color: 'var(--priority-low)' },
  { value: 'medium', label: 'Medium', icon: '🟡', color: 'var(--priority-medium)' },
  { value: 'high', label: 'High', icon: '🟠', color: 'var(--priority-high)' },
  { value: 'critical', label: 'Critical', icon: '🔴', color: 'var(--priority-critical)' },
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

// Predefined tag colors (for visual variety)
export const TAG_COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981',
  '#f59e0b', '#ef4444', '#ec4899', '#14b8a6',
];

// Items per page options
export const PAGE_SIZES = [5, 10, 20, 50];

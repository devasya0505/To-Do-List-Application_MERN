import { useState, useCallback } from 'react';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/helpers';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [trash, setTrash] = useState([]);

  const toast = useToast();

  // Fetch tasks with filters, sorting, pagination
  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await API.get('/tasks', { params });
      setTasks(res.data.data.tasks);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error('Failed to load tasks', getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create task
  const createTask = useCallback(async (taskData) => {
    const res = await API.post('/tasks', taskData);
    toast.success('Task created', `"${res.data.data.task.title}" has been added`);
    return res.data.data.task;
  }, [toast]);

  // Update task
  const updateTask = useCallback(async (id, taskData) => {
    const res = await API.put(`/tasks/${id}`, taskData);
    toast.success('Task updated', 'Your changes have been saved');
    return res.data.data.task;
  }, [toast]);

  // Update task status (for Kanban)
  const updateTaskStatus = useCallback(async (id, status) => {
    const res = await API.patch(`/tasks/${id}/status`, { status });
    return res.data.data.task;
  }, []);

  // Soft delete
  const deleteTask = useCallback(async (id) => {
    await API.delete(`/tasks/${id}`);
    toast.success('Task deleted', 'Moved to trash');
  }, [toast]);

  // Restore from trash
  const restoreTask = useCallback(async (id) => {
    const res = await API.patch(`/tasks/${id}/restore`);
    toast.success('Task restored', 'The task has been restored');
    return res.data.data.task;
  }, [toast]);

  // Permanent delete
  const permanentDeleteTask = useCallback(async (id) => {
    await API.delete(`/tasks/${id}/permanent`);
    toast.success('Permanently deleted', 'The task has been permanently removed');
  }, [toast]);

  // Fetch trash
  const fetchTrash = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/tasks/trash');
      setTrash(res.data.data.tasks);
    } catch (err) {
      toast.error('Failed to load trash', getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await API.get('/tasks/analytics');
      setAnalytics(res.data.data);
    } catch (err) {
      toast.error('Failed to load analytics', getErrorMessage(err));
    }
  }, [toast]);

  // Export CSV
  const exportCSV = useCallback(async () => {
    try {
      const res = await API.get('/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tasks_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Export complete', 'Tasks downloaded as CSV');
    } catch (err) {
      toast.error('Export failed', getErrorMessage(err));
    }
  }, [toast]);

  return {
    tasks,
    setTasks,
    pagination,
    loading,
    analytics,
    trash,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    restoreTask,
    permanentDeleteTask,
    fetchTrash,
    fetchAnalytics,
    exportCSV,
  };
};

export default useTasks;

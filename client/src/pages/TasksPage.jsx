import { useState, useEffect, useCallback } from 'react';
import useTasks from '../hooks/useTasks';
import TaskList from '../components/tasks/TaskList';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/helpers';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TasksPage = ({ searchTerm = '' }) => {
  const {
    tasks,
    pagination,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    exportCSV,
  } = useTasks();

  const toast = useToast();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    dueBefore: '',
    dueAfter: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Count active filters
  const activeFilterCount = [
    filters.status, filters.priority, filters.dueBefore, filters.dueAfter,
  ].filter(Boolean).length;

  // Build params and fetch
  const loadTasks = useCallback(() => {
    const params = { ...filters };
    if (searchTerm) params.search = searchTerm;
    // Remove empty values
    Object.keys(params).forEach((key) => {
      if (!params[key] && params[key] !== 0) delete params[key];
    });
    fetchTasks(params);
  }, [filters, searchTerm, fetchTasks]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Reset page when search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [searchTerm]);

  const handleCreateOrUpdate = async (formData) => {
    setSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
      } else {
        await createTask(formData);
      }
      setShowModal(false);
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      toast.error('Failed', getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      toast.error('Failed', getErrorMessage(err));
    }
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: '',
      priority: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      dueBefore: '',
      dueAfter: '',
    });
  };

  const handleExportPDF = () => {
    if (tasks.length === 0) {
      toast.warning('No tasks', 'There are no tasks to export');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('TaskFlow — Tasks Report', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = tasks.map((t) => [
      t.title,
      t.status,
      t.priority,
      (t.tags || []).join(', '),
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A',
    ]);

    doc.autoTable({
      startY: 38,
      head: [['Title', 'Status', 'Priority', 'Tags', 'Due Date']],
      body: tableData,
      styles: { fontSize: 9, font: 'helvetica' },
      headStyles: { fillColor: [99, 102, 241] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`tasks_${Date.now()}.pdf`);
    toast.success('PDF exported', 'Your tasks have been downloaded as PDF');
  };

  return (
    <div id="tasks-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Tasks</h1>
          <p>{pagination.total} task{pagination.total !== 1 ? 's' : ''} total</p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowFilters(!showFilters)}
            id="toggle-filters"
          >
            🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={exportCSV} id="export-csv-btn">
            📤 CSV
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportPDF} id="export-pdf-btn">
            📄 PDF
          </button>
          <button
            className="btn btn-primary"
            onClick={() => { setEditingTask(null); setShowModal(true); }}
            id="create-task-btn"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <TaskFilters
          filters={filters}
          onChange={setFilters}
          onClear={clearFilters}
          activeCount={activeFilterCount}
        />
      )}

      {/* Task list */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingTask(null); }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => { setShowModal(false); setEditingTask(null); }}
          loading={submitting}
        />
      </Modal>

      {/* FAB for mobile */}
      <button
        className="fab"
        onClick={() => { setEditingTask(null); setShowModal(true); }}
        aria-label="Create new task"
        id="fab-create"
      >
        +
      </button>
    </div>
  );
};

export default TasksPage;

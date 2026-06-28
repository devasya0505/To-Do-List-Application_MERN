import { useEffect } from 'react';
import useTasks from '../../hooks/useTasks';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/helpers';

const TrashView = () => {
  const { trash, loading, fetchTrash, restoreTask, permanentDeleteTask } = useTasks();

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  const handleRestore = async (id) => {
    await restoreTask(id);
    fetchTrash();
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm('This will permanently delete the task. This action cannot be undone.')) {
      await permanentDeleteTask(id);
      fetchTrash();
    }
  };

  if (loading) return <Loader text="Loading trash..." />;

  if (trash.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="task-list-empty-icon">🗑️</div>
        <h3>Trash is empty</h3>
        <p>Deleted tasks will appear here for 30 days before being permanently removed</p>
      </div>
    );
  }

  return (
    <div className="task-list" id="trash-list">
      {trash.map((task, index) => (
        <div
          key={task._id}
          className="trash-card"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="trash-card-info">
            <div className="trash-card-title">{task.title}</div>
            <div className="trash-card-meta">
              Deleted {formatDate(task.deletedAt)} · {task.status} · {task.priority} priority
            </div>
          </div>
          <div className="trash-card-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleRestore(task._id)}
              id={`restore-${task._id}`}
            >
              ♻️ Restore
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handlePermanentDelete(task._id)}
              id={`perm-delete-${task._id}`}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrashView;

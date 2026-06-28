import { formatDate, isOverdue, isToday, getRelativeTime } from '../../utils/helpers';

const TaskCard = ({ task, onEdit, onDelete, index = 0 }) => {
  const overdue = isOverdue(task.dueDate, task.status);
  const today = isToday(task.dueDate);

  const statusLabels = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'completed': 'Completed',
  };

  const priorityLabels = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'critical': 'Critical',
  };

  return (
    <div
      className="task-card"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => onEdit && onEdit(task)}
      id={`task-card-${task._id}`}
    >
      {/* Priority stripe */}
      <div className={`task-card-priority-stripe ${task.priority}`} />

      {/* Header */}
      <div className="task-card-header">
        <h3 className={`task-card-title ${task.status === 'completed' ? 'completed' : ''}`}>
          {task.title}
        </h3>
        <div className="task-card-actions">
          <button
            className="task-card-action-btn"
            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task); }}
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            className="task-card-action-btn delete"
            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task._id); }}
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      {/* Footer with badges */}
      <div className="task-card-footer">
        <div className="task-card-meta">
          <span className={`badge badge-status-${task.status}`}>
            {statusLabels[task.status]}
          </span>
          <span className={`badge badge-priority-${task.priority}`}>
            {priorityLabels[task.priority]}
          </span>

          {/* Tags */}
          {task.tags && task.tags.map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>

        {/* Due date */}
        {task.dueDate && (
          <span className={`due-date ${overdue ? 'overdue' : today ? 'today' : 'upcoming'}`}>
            📅 {overdue ? `Overdue: ${formatDate(task.dueDate)}` : getRelativeTime(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

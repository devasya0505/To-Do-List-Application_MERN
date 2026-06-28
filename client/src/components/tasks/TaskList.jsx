import TaskCard from './TaskCard';
import Loader from '../common/Loader';

const TaskList = ({ tasks, loading, onEdit, onDelete }) => {
  if (loading) {
    return <Loader text="Loading tasks..." />;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="task-list-empty-icon">📝</div>
        <h3>No tasks found</h3>
        <p>Create your first task or adjust your filters</p>
      </div>
    );
  }

  return (
    <div className="task-list" id="task-list">
      {tasks.map((task, index) => (
        <TaskCard
          key={task._id}
          task={task}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;

import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import useTasks from '../../hooks/useTasks';
import { useToast } from '../../context/ToastContext';
import { formatDate, isOverdue } from '../../utils/helpers';
import Loader from '../common/Loader';

const KanbanBoard = ({ searchTerm = '' }) => {
  const { loading, fetchTasks, updateTaskStatus, tasks, deleteTask } = useTasks();
  const toast = useToast();
  const [columns, setColumns] = useState({
    pending: [],
    'in-progress': [],
    completed: [],
  });

  const loadTasks = useCallback(async () => {
    const params = { limit: 100 };
    if (searchTerm) params.search = searchTerm;
    await fetchTasks(params);
  }, [fetchTasks, searchTerm]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Group tasks into columns whenever tasks change
  useEffect(() => {
    const grouped = {
      pending: tasks.filter((t) => t.status === 'pending'),
      'in-progress': tasks.filter((t) => t.status === 'in-progress'),
      completed: tasks.filter((t) => t.status === 'completed'),
    };
    setColumns(grouped);
  }, [tasks]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    // Optimistic update
    const newColumns = { ...columns };
    const sourceItems = [...newColumns[sourceCol]];
    const [movedTask] = sourceItems.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: destCol };

    const destItems = sourceCol === destCol ? sourceItems : [...newColumns[destCol]];
    destItems.splice(destination.index, 0, updatedTask);

    newColumns[sourceCol] = sourceCol === destCol ? destItems : sourceItems;
    if (sourceCol !== destCol) newColumns[destCol] = destItems;

    setColumns(newColumns);

    // API update
    if (sourceCol !== destCol) {
      try {
        await updateTaskStatus(draggableId, destCol);
        const statusLabels = { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed' };
        toast.success('Status updated', `Task moved to ${statusLabels[destCol]}`);
      } catch {
        // Revert on failure
        loadTasks();
        toast.error('Update failed', 'Could not update task status');
      }
    }
  };

  const columnConfig = [
    { id: 'pending', title: 'Pending', dot: 'pending', icon: '⏳' },
    { id: 'in-progress', title: 'In Progress', dot: 'in-progress', icon: '🔄' },
    { id: 'completed', title: 'Completed', dot: 'completed', icon: '✅' },
  ];

  if (loading && tasks.length === 0) {
    return <Loader text="Loading kanban board..." />;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board" id="kanban-board">
        {columnConfig.map((col) => (
          <Droppable key={col.id} droppableId={col.id}>
            {(provided, snapshot) => (
              <div
                className={`kanban-column ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="kanban-column-header">
                  <div className="kanban-column-title">
                    <div className={`kanban-column-dot ${col.dot}`} />
                    {col.title}
                  </div>
                  <span className="kanban-column-count">
                    {columns[col.id]?.length || 0}
                  </span>
                </div>

                <div className="kanban-cards">
                  {columns[col.id]?.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className={`task-card-priority-stripe ${task.priority}`} />
                          <div style={{ paddingLeft: '12px' }}>
                            <h4 style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              marginBottom: '6px',
                              textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                              opacity: task.status === 'completed' ? 0.6 : 1,
                            }}>
                              {task.title}
                            </h4>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span className={`badge badge-priority-${task.priority}`}>
                                {task.priority}
                              </span>
                              {task.tags?.slice(0, 2).map((tag) => (
                                <span key={tag} className="tag">{tag}</span>
                              ))}
                            </div>
                            {task.dueDate && (
                              <div className={`due-date ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}
                                style={{ marginTop: '8px' }}
                              >
                                📅 {formatDate(task.dueDate)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {columns[col.id]?.length === 0 && (
                    <div style={{
                      textAlign: 'center',
                      padding: '24px 12px',
                      color: 'var(--text-tertiary)',
                      fontSize: '0.8125rem',
                    }}>
                      {col.icon} Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;

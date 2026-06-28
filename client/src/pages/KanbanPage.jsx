import KanbanBoard from '../components/tasks/KanbanBoard';

const KanbanPage = ({ searchTerm = '' }) => {
  return (
    <div id="kanban-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Kanban Board</h1>
          <p>Drag and drop tasks between columns to update their status</p>
        </div>
      </div>

      <KanbanBoard searchTerm={searchTerm} />
    </div>
  );
};

export default KanbanPage;

import TrashView from '../components/tasks/TrashView';

const TrashPage = () => {
  return (
    <div id="trash-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Trash</h1>
          <p>Deleted tasks are kept for 30 days before permanent removal</p>
        </div>
      </div>

      <TrashView />
    </div>
  );
};

export default TrashPage;

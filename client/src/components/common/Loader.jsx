const Loader = ({ size = 'md', text = '' }) => {
  return (
    <div className="page-loader">
      <div className={`spinner ${size}`} />
      {text && <p className="page-loader-text">{text}</p>}
    </div>
  );
};

export default Loader;

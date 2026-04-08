const Pagination = ({ page, totalPages, onChange }) => {
  const safeTotal = Math.max(totalPages || 1, 1);

  return (
    <div className="pagination">
      <button type="button" className="btn btn-outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span>
        Page {page} of {safeTotal}
      </span>
      <button
        type="button"
        className="btn btn-outline"
        disabled={page >= safeTotal}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

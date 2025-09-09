import React from "react";

const Pagination = ({
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25],
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(startIndex + rowsPerPage - 1, totalItems);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  return (
    <div className="d-flex align-items-center justify-content-end py-1">
      {/* Rows per page */}
      <p className="mb-0 fs-2">Rows per page:</p>
      <select
        className="form-select w-auto ms-0 ms-sm-2 me-8 me-sm-4 py-1 pe-7 ps-2 border-0"
        value={rowsPerPage}
        onChange={(e) => {
          onRowsPerPageChange(Number(e.target.value));
        }}
      >
        {rowsPerPageOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      {/* Range */}
      <p className="mb-0 fs-2">
        {totalItems === 0
          ? "0–0 of 0"
          : `${startIndex}–${endIndex} of ${totalItems}`}
      </p>

      {/* Navigation */}
      <nav aria-label="Pagination">
        <ul className="pagination justify-content-center mb-0 ms-8 ms-sm-9">
          {/* Prev Button */}
          <li className="page-item p-1">
            <button
              className={`page-link border-0 rounded-circle text-dark fs-6 round-32 d-flex align-items-center justify-content-center ${
                isFirstPage ? "disabled-btn" : ""
              }`}
              disabled={isFirstPage}
              onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            >
              <i className="ti ti-chevron-left"></i>
            </button>
          </li>

          {/* Next Button */}
          <li className="page-item p-1">
            <button
              className={`page-link border-0 rounded-circle text-dark fs-6 round-32 d-flex align-items-center justify-content-center ${
                isLastPage ? "disabled-btn" : ""
              }`}
              disabled={isLastPage}
              onClick={() => !isLastPage && onPageChange(currentPage + 1)}
            >
              <i className="ti ti-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;

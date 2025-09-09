import React, { useState } from "react";
import Pagination from "./Pagination";

const DataTable = ({ columns, data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);
  console.log(paginatedData)
  return (
    <div className="card card-body">
      <div className="table-responsive">
        <table className="table search-table align-middle text-nowrap">
          <thead className="header-item">
            <tr>
              {columns.map((col) => (
                <th key={col.accessor || col.label}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="search-items">
                  {columns.map((col) => (
                    <td key={col.accessor || col.label}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-3">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reusable Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={data.length}
        rowsPerPage={rowsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        onRowsPerPageChange={(size) => {
          setRowsPerPage(size);
          setCurrentPage(1); // reset to first page
        }}
      />
    </div>
  );
};

export default DataTable;

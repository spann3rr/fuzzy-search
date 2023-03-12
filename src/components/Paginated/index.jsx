import React, { useState } from 'react';

const Paginated = ({ currentPage, data, itemsPerPage, onPageChange }) => {
  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
  pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={currentPage === number ? 'active' : ''}
              >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Paginated;

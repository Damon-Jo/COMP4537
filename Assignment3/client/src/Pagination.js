import React from "react";
import { useState } from "react";

function Pagination({ numberOfPages, currentPage, setCurrentPage }) {
  const pageNumbers = [];
  for (let index = 1; index <= numberOfPages; index++) {
    pageNumbers.push(index);
  }
  const nextPage = () => {
    if (currentPage !== numberOfPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      {currentPage !== 1 && <button onClick={prevPage}>prev </button>}

      {pageNumbers.map((number) => {
        if (number < currentPage + 6 && number > currentPage - 6)
          return (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={number == currentPage ? "active" : ""}
            >
              {number}
            </button>
          );
      })}

      {currentPage !== numberOfPages && (
        <button onClick={nextPage}>next</button>
      )}
    </div>
  );
}

export default Pagination;

import React from 'react'
import { useState } from 'react'
import './App.css';

function Pagination({ numberOfPages, currentPage, setCurrentPage }) {
  const pageNumbers = []
  for (let index = 1; index <= numberOfPages; index++) {
    pageNumbers.push(index)
  }
  const nextPage = () => {
    toggleActive(currentPage)
    if (currentPage !== numberOfPages) setCurrentPage(currentPage + 1)

    if(currentPage + 1 === numberOfPages) setNextBtnActive(false)
  }
  const prevPage = () => {
    toggleActive(currentPage-2)
    if (currentPage !== 1) setCurrentPage(currentPage - 1)
    if(currentPage - 1 === 1) setPreBtnActive(false)
  }

let [preBtnActive, setPreBtnActive] = useState(false);
let [nextBtnActive, setNextBtnActive] = useState(true);


const isFirstPage = (index)=>{
  var pageNumber = index + 1;
  if(pageNumber === 1){
    setPreBtnActive(false);
  } else {
    setPreBtnActive(true);
  }
}

const isLastPage = (index)=>{
  var pageNumber = index + 1;
  if(pageNumber === numberOfPages){
    setNextBtnActive(false);
  } else {
    setNextBtnActive(true);
  }
}

let [btnActive, setBtnActive] = useState("");

const toggleActive = (e) => {
  setBtnActive((prev) => {
    return e;
  });
};

// const [active, setActive] = useState(false);
// const handleClick = (page) => {

//   setActive(!active);
// };
  return (
    <div>
      {
        preBtnActive == true ? <button onClick={prevPage}>prev </button> : null
      }
      {
        pageNumbers.map((number, i) => {
          return (
          <>
            <button
             
              value={i}
              className={(i == btnActive ? "active" : "")}
              onClick={() => [toggleActive(i), setCurrentPage(number), isFirstPage(i), isLastPage(i)]}
              >
              {number}
            </button>
          </>)
        })
      }
      {
        nextBtnActive == true ? <button  onClick={nextPage}>next</button> : null
      }
    </div>
  )
}

export default Pagination
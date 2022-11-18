import React from 'react'
import { useState } from 'react'

function Pagination({ numberOfPages, currentPage, setCurrentPage }) {
  const pageNumbers = []
  for (let i = 1; i <= numberOfPages; i++) {
    pageNumbers.push(i)
  }
  const nextPage = () => {
    if (currentPage !== numberOfPages) setCurrentPage(currentPage + 1)
  }
  const prevPage = () => {
    console.log(currentPage)
    if (currentPage !== 1) setCurrentPage(currentPage - 1)
    
    if(currentPage - 1 === 1) setPreBtnActive(false)
  }
let [preBtnActive, setPreBtnActive] = useState(false);
let [nextBtnActive, setNextBtnActive] = useState(true);
//   const toggleActive = (e) => {
//     setBtnActive((prev) => {
//       return e.target.value;
//     });
//   };

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



  return (
    <div>
      {
        preBtnActive == true ? <button onClick={prevPage}>prev </button> : null
      }


      {/* <button onClick={prevPage}>prev </button> */}

      {
        pageNumbers.map((number, i) => {
          return (<>
            <button style={{background:'' }} onClick={() => [setCurrentPage(number), isFirstPage(i), isLastPage(i)]}>
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
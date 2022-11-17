import React from 'react'

function pagination({ numberOfPages, currentPage, setCurrentPage }) {
  const pageNumbers = []
  for (let i = 1; i <= numberOfPages; i++) {
    pageNumbers.push(i)
  }
  const nextPage = () => {
    if (currentPage !== numberOfPages) setCurrentPage(currentPage + 1)
  }
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1)
  }
//   let [btnActive, setBtnActive] = useState("");

//   const toggleActive = (e) => {
//     setBtnActive((prev) => {
//       return e.target.value;
//     });
//   };


  return (
    <div>
      <button onClick={prevPage}>prev </button>

      {
        pageNumbers.map(number => {
          return (<>
            <button style={{background:'' }} onClick={() => setCurrentPage(number)}>
              {number}
            </button>
          </>)
        })
      }

      <button  onClick={nextPage}>
        next
      </button>
    </div>
  )
}

export default pagination
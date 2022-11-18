
import React from 'react'

function page({ currentPokemons, currentPage }) {
  return (
    <div>
      <h1>
        Page number {currentPage}
      </h1>
      {
        currentPokemons.map(currentPokemon => {
          return <div>  {currentPokemon.name.english} id is {currentPokemon.id} </div>
        })
      }
    </div>
  )
}

export default page
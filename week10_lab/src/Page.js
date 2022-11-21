
import React from 'react'
import Pokemon from './Pokemon'

function page({ currentPokemons, currentPage }) {
  return (
    <div>
      <h1>
        Page number {currentPage}
      </h1>
      <div className="pokemon-list">
        {
          currentPokemons.map(currentPokemon => {
            return <Pokemon pokemon={currentPokemon} />
          })
        }
      </div>
      
    </div>
  )
}

export default page
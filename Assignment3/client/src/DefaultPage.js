import React, { useEffect, useState } from 'react'
import Page from './frontPage'
import Pagination from './Pagination';
import axios from 'axios'
import Filters from './Filters';

function DefaultPage() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(10);
  const [filteredPokemons, setFilteredPokemons] = useState([]);

  useEffect(() => {
    setFilteredPokemons(pokemons)
      ;
  }, [pokemons]
  );

  // Get Pokemon types from pokemon
  const types = ['Grass', 'Poison', 'Fire', 'Flying', 'Water', 'Bug', 'Normal', 'Electric', 'Ground', 'Fairy', 'Fighting', 'Psychic', 'Rock', 'Steel', 'Ice', 'Ghost', 'Dragon', 'Dark']

  useEffect(() => {
    try {
      axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
        .then(res => res.data)
        .then(res => {
          setPokemons(res)
          localStorage.setItem('pokemons', JSON.stringify(res))
        })
        .catch(err => console.log("err", err))
    } catch (error) {
      console.log("error", error)
      setPokemons(localStorage.getItem('pokemons'))
    }
  }, [])

  const jumpToAdminLogin = () => {
    window.location.href = "/adminLogin"
    }
    

  const indexOfLastRecord = currentPage * pokemonsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(indexOfFirstRecord, indexOfLastRecord)
  const numberOfPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);

  return (
    <>
    <button onClick={jumpToAdminLogin}>Login As Administrator</button>
      < Filters
        setCurrentPage={setCurrentPage}
        pokemons={pokemons}
        setFilteredPokemon={setFilteredPokemons}
        setSelectedTypes={setSelectedTypes}
        selectedTypes={selectedTypes}
        types={types}
      />
      < Page
        currentPokemons={currentPokemons}
        currentPage={currentPage}
      />
      < Pagination
        numberOfPages={numberOfPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  )
}

export default DefaultPage
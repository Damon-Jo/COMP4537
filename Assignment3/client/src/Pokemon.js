import React, { useEffect, useState } from "react";
import Page from "./Page";
import Pagination from "./Pagination";
import axios from "axios";

function Pokemon() {
    const [pokemons, setPokemons] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pokemonsPerPage] = useState(10);
  
    useEffect(() => {
      axios
        .get(
          "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"
        )
        .then((res) => res.data)
        .then((data) => {
          data = data.filter((pokemon) =>
            checkedState.every(
              (checked, i) => !checked || pokemon.type.includes(types.current[i])
            )
          );
          return data;
        })
        .then((res) => {
          setPokemons(res);
        })
        .catch((err) => console.log("err", err));
    }, [checkedState]);
  
    const indexOfLastRecord = currentPage * pokemonsPerPage; // 1 * 10
    const indexOfFirstRecord = indexOfLastRecord - pokemonsPerPage; // 10 - 10
    const currentPokemons = pokemons.slice(indexOfFirstRecord, indexOfLastRecord);
    const numberOfPages = Math.ceil(pokemons.length / pokemonsPerPage);
    return (
      <>
        <Page currentPokemons={currentPokemons} currentPage={currentPage} />
        <Pagination
          numberOfPages={numberOfPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </>
    );
  }

export default Pokemon
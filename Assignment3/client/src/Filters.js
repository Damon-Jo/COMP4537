import React from "react";

const Filters = ({pokemons, types, selectedTypes, setSelectedTypes, setCurrentPage, setFilteredPokemon}) => {
    const handlerForSearchingType = (e) => {
        var localSelectedTypes = selectedTypes;
        if (selectedTypes.includes(e.target.value)) {
            localSelectedTypes.splice(localSelectedTypes.indexOf(e.target.value), 1)
            setSelectedTypes(localSelectedTypes)
        } else {
            localSelectedTypes = [...selectedTypes, e.target.value]
            setSelectedTypes(localSelectedTypes)
        }
        setFilteredPokemon(pokemons.filter((pokemon) => localSelectedTypes.every((type) => pokemon.type.includes(type))))
        setCurrentPage(1)
    };

    const handlerForSearchingName = (e) => {
        if (document.getElementById("english").checked) {
            setFilteredPokemon(pokemons.filter((pokemon) => pokemon.name.english.toLowerCase().includes(e.target.value.toLowerCase())))
        }
        else if (document.getElementById("japanese").checked) {
            setFilteredPokemon(pokemons.filter((pokemon) => pokemon.name.japanese.toLowerCase().includes(e.target.value.toLowerCase())))
        }
        else if (document.getElementById("chinese").checked) {
            setFilteredPokemon(pokemons.filter((pokemon) => pokemon.name.chinese.toLowerCase().includes(e.target.value.toLowerCase())))
        }
        else if (document.getElementById("french").checked) {
            setFilteredPokemon(pokemons.filter((pokemon) => pokemon.name.french.toLowerCase().includes(e.target.value.toLowerCase())))
        } else {
            setFilteredPokemon(pokemons.filter((pokemon) => pokemon.name.english.toLowerCase().includes(e.target.value.toLowerCase())))
        }
        setCurrentPage(1)
    }

    return (
        <div >

            <div style={{border: '2px solid black', padding:'10px'}}>

                <h3>Filter by Name</h3>
                <input type="text" placeholder="Search by name" onChange={handlerForSearchingName} />
                <input type="radio" id="english" name="fav_language" value="english"></input>
                <label for="English">English</label>

                <input type="radio" id="french" name="fav_language" value="french"></input>
                <label for="French">French</label>

                <input type="radio" id="japanese" name="fav_language" value="japanese"></input>
                <label for="Japanese">Japanese</label>

                <input type="radio" id="chinese" name="fav_language" value="chinese"></input>
                <label for="chinese">Chinese</label>
            </div>

            <div style={{border: '2px solid black', padding:'10px'}}>
                <h3>Filter by Type</h3>

                {types.map((pokemonType, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={"pokemon-" + pokemonType}
                            onChange={handlerForSearchingType}
                            value={pokemonType}
                        />
                        <label htmlFor={"pokemon-" + pokemonType}>{pokemonType}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Filters;
import React, {useState, useEffect } from 'react'
import City from './City'

function Cities() {

    const [cities, setCities] = useState([])

    const url = "http://localhost:5000/cities"

    useEffect(()=>{
        fetch(url)
        .then((resp)=>{return resp.json() })
        .then((resp)=>{
            console.log(resp);
            setCities(resp)
        })
    },[])

  return (
    <>
    Cities components
    <hr />
    {cities.map((aCity) => {return <City aCity={aCity}/>})}

    </>
  )
}

export default Cities
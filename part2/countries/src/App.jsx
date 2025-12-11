import { useState, useEffect } from "react";
import countriesServices from './services/countries'
import Countries from "./components/Countries";

const App = () => {
  const [countries, setCountries] = useState([])
  const [newCountry, setNewCountry] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countriesServices
      .getAll()
      .then(response => {
        setCountries(response)
      })
  }, [])

  const handleCountriesChange = (event) => {
    setNewCountry(event.target.value)
    setSelectedCountry(null)
  }


  const countriesFilter = countries.filter(country =>
    country.name.common.toLowerCase().includes(newCountry.toLowerCase())
  )


  return (
    <div>
      find countries <input value={newCountry} onChange={handleCountriesChange} />
      <Countries 
        countriesFilter={countriesFilter} 
        newCountry={newCountry} 
        selectedCountry={selectedCountry} 
        setSelectedCountry={setSelectedCountry}/>
    </div>
  )
}

export default App
import weatherServices from "../services/weather"
import { useState, useEffect } from "react"

const flagStyle = {
  fontSize: '200px'
}

const Countries = ({ countriesFilter, newCountry, selectedCountry, setSelectedCountry}) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!selectedCountry) return

    weatherServices
      .getWeather(selectedCountry.latlng[0], selectedCountry.latlng[1])
      .then(data => setWeather(data))
  }, [selectedCountry])

  if (newCountry.trim() === "") {
    return null
  } 

  if (selectedCountry) {
    const country = selectedCountry
    console.log(weather)

    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital[0]}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <div style={flagStyle}>{country.flag}</div>
        <h2>Weather in {country.capital[0]}</h2>
        {weather ? (
          <>
            <p>Temperature: {weather.main.temp} Celsius</p>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt="weather icon" 
            />
            <p>Wind: {weather.wind.speed} m/s</p>
          </>
        ) : (
          <p>Loading weather...</p>
        )}
      </div>
    )
  }

  if (countriesFilter.length === 1) {
    const country = countriesFilter[0]

    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital[0]}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <div style={flagStyle}>{country.flag}</div>
        {weather ? (
          <>
            <p>Temperature: {weather.main.temp} Celsius</p>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt="weather icon" 
            />
            <p>Wind: {weather.wind.speed} m/s</p>
          </>
        ) : (
          <p>Loading weather...</p>
        )}
      </div>
    )
  }
  
  if (countriesFilter.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  
  return (
    <div>
      {countriesFilter.map(country => 
        <div key={country.name.common}>{country.name.common} <button onClick={() => setSelectedCountry(country)}>show</button></div>
      )}
    </div>
  )
}

export default Countries
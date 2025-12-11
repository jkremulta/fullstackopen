import axios from "axios";

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getWeather = (lat, lon) => {
  const api_key = import.meta.env.VITE_WEATHER_API
  const url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
  
  const request = axios.get(url)
  return request.then(response => response.data)
}

export default {
  getWeather
}
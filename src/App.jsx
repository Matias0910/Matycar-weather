import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import { getWeatherData, getWeatherForecast } from './services/weatherService';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Carga una ciudad por defecto al iniciar
  useEffect(() => {
    handleSearch('Buenos Aires');
  }, []);

  const handleSearch = async (city) => {
    setLoading(true);
    setError('');
    try {
      const weatherData = await getWeatherData(city);
      const forecastData = await getWeatherForecast(city);
      
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError('No se pudo encontrar la ciudad. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col items-center p-6 sm:p-12 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          MatyCar Weather
        </h1>
      </header>

      <Search onSearch={handleSearch} />

      {loading && (
        <div className="text-cyan-400 animate-pulse text-lg font-medium my-8">
          Buscando datos del clima...
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg my-4 text-sm">
          {error}
        </div>
      )}

      {weather && !loading && <WeatherCard data={weather} />}
      
      {forecast.length > 0 && !loading && <Forecast forecastData={forecast} />}
    </div>
  );
}

export default App;
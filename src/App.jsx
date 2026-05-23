import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import { getWeatherData, getWeatherDataByCoords } from "./services/weatherService";

function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1920&q=80"); // Fondo por defecto

  // Mapeo de fondos según el clima de OpenWeather
  const updateBackground = (mainCondition) => {
    const backgrounds = {
      Clear: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920&q=80", // Soleado / Despejado
      Clouds: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80", // Nublado
      Rain: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1920&q=80", // Lluvia
      Drizzle: "https://images.unsplash.com/photo-1556485689-33e55ab56127?auto=format&fit=crop&w=1920&q=80", // Llovizna
      Thunderstorm: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=1920&q=80", // Tormenta
      Snow: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1920&q=80", // Nieve
    };
    setBgImage(backgrounds[mainCondition] || "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1920&q=80");
  };

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(city);
      setWeather(data);
      updateBackground(data.current.weather[0].main);
    } catch (err) {
      setError("No se pudo encontrar la ciudad. ¡Probá de nuevo!");
    } finally {
      setLoading(false);
    }
  };

  // Geolocalización por GPS al cargar la app
  const handleLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await getWeatherDataByCoords(latitude, longitude);
            setWeather(data);
            updateBackground(data.current.weather[0].main);
          } catch (err) {
            setError("Error al obtener el clima de tu ubicación.");
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError("Permiso de ubicación denegado. Buscá manualmente.");
          setLoading(false);
        }
      );
    }
  };

  useEffect(() => {
    handleLocation(); // Arranca buscando la ubicación actual del usuario
  }, []);

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-start p-4 sm:p-8"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* Contenedor principal con efecto Blur Vidrio */}
      <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl mt-4">
        
        <header className="mb-8 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            MatyCar Weather <span className="text-cyan-400 font-light">Pro</span>
          </h1>
          <button 
            onClick={handleLocation}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition duration-300 shadow-lg shadow-cyan-500/20 active:scale-95 text-sm"
          >
            📍 Mi Ubicación
          </button>
        </header>

        <Search onSearch={handleSearch} />

        {loading && (
          <div className="text-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-white font-medium animate-pulse">Obteniendo el radar...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-200 p-4 rounded-2xl text-center my-6 font-medium">
            ⚠️ {error}
          </div>
        )}

        {weather && !loading && (
          <div className="space-y-8 animate-fadeIn">
            <WeatherCard current={weather.current} />
            <Forecast forecast={weather.forecast} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
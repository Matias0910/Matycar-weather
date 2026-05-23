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
    className="w-full min-h-screen bg-cover bg-center flex items-center justify-center p-0 sm:p-4 md:p-8 select-none transition-all duration-700 ease-in-out"
    style={{ backgroundImage: `url('${bgImage}')` }} // <-- ¡Acá vuelve la magia del fondo dinámico!
  >
    {/* Contenedor Rectángulo Tipo App Real con súper blur para que resalte el fondo */}
    <div className="w-full h-screen sm:h-[85vh] sm:max-w-md bg-slate-950/40 backdrop-blur-xl border-0 sm:border border-white/10 sm:rounded-3xl p-5 shadow-2xl flex flex-col justify-start overflow-y-auto scrollbar-none">
      
      {/* Encabezado Compacto */}
      <header className="mb-4 flex justify-between items-center gap-2 mt-2">
        <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
          MatyCar Weather <span className="text-cyan-400 font-light text-base">Pro</span>
        </h1>
        <button 
          onClick={handleLocation}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold p-2 rounded-xl flex items-center gap-2 transition duration-300 shadow-lg shadow-cyan-500/20 active:scale-95 text-xs"
        >
          📍 Mi Ubicación
        </button>
      </header>

      {/* Buscador */}
      <Search onSearch={handleSearch} />

      {/* Pantalla de carga */}
      {loading && (
        <div className="text-center my-auto">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-cyan-400 mx-auto mb-3"></div>
          <p className="text-white text-sm font-medium animate-pulse">Conectando con el satélite...</p>
        </div>
      )}

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-200 p-3 rounded-xl text-center my-4 text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Datos del Clima */}
      {weather && !loading && (
        <div className="space-y-4 animate-fadeIn flex-1">
          <WeatherCard current={weather.current} />
          <Forecast forecastList={weather.rawForecastList || weather.forecast} />
        </div>
      )}
    </div>
  </div>
);
}

export default App;
import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import Mascota from "./components/Mascota";
import { getWeatherData, getWeatherDataByCoords } from "./services/weatherService";

function App() {
  const defaultWeather = {
    current: {
      weather: [{ main: "Clear", description: "Despejado", icon: "01d" }],
      main: { temp: 22, temp_min: 18, temp_max: 26, feels_like: 22, humidity: 60, pressure: 1012 },
      wind: { speed: 1.5, deg: 120 },
      visibility: 10000,
      dt: Math.floor(Date.now() / 1000),
      sys: {
        sunrise: Math.floor(Date.now() / 1000) - 3600,
        sunset: Math.floor(Date.now() / 1000) + 3600,
      },
      name: "Buenos Aires",
    },
    forecast: [],
    rawForecastList: [],
  };

  const [weather, setWeather] = useState(defaultWeather);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1920&q=80"); // Fondo por defecto
  const [unit, setUnit] = useState("metric"); // 'metric' para °C, 'imperial' para °F
  const [fixedCity, setFixedCity] = useState(null);
  const [currentCity, setCurrentCity] = useState("");

  // Mapeo de fondos según el clima de OpenWeather
  const updateBackground = (mainCondition, dt, sunrise, sunset) => {
    const isNight = dt && sunrise && sunset ? (dt < sunrise || dt > sunset) : false;

    const backgrounds = {
      Clear: isNight 
        ? "https://images.unsplash.com/photo-1532973334994-66f6c5e229c1?auto=format&fit=crop&w=1920&q=80" 
        : "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920&q=80",
      Clouds: isNight
        ? "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1920&q=80"
        : "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80",
      Rain: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1920&q=80", // Lluvia
      Drizzle: "https://images.unsplash.com/photo-1556485689-33e55ab56127?auto=format&fit=crop&w=1920&q=80", // Llovizna
      Thunderstorm: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=1920&q=80", // Tormenta
      Snow: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1920&q=80", // Nieve
    };

    setBgImage(backgrounds[mainCondition] || "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1920&q=80");
  };

  // Convertir temperatura según la unidad seleccionada
  const convertTemp = (temp) => {
    if (unit === "metric") return Math.round(temp);
    return Math.round((temp * 9/5) + 32);
  };

  const handleSearch = async (city, options = { persist: true }) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setCurrentCity(city);

    try {
      const data = await getWeatherData(city);
      setWeather(data);
      updateBackground(data.current.weather[0].main, data.current.dt, data.current.sys.sunrise, data.current.sys.sunset);

      if (options.persist) {
        localStorage.setItem("lastCity", city); // Guardamos la ciudad
      }
      if (fixedCity === city) {
        localStorage.setItem("fixedCity", city);
      }
    } catch (err) {
      setError("No se pudo encontrar la ciudad. ¡Probá de nuevo!");
    } finally {
      setLoading(false);
    }
  };

  const toggleFixedCity = () => {
    if (!currentCity) {
      setError("Primero busca una ciudad para fijarla.");
      return;
    }

    if (fixedCity === currentCity) {
      setFixedCity(null);
      localStorage.removeItem("fixedCity");
      setError("Ciudad fija liberada. Ahora puedes buscar otra ciudad.");
    } else {
      setFixedCity(currentCity);
      localStorage.setItem("fixedCity", currentCity);
      setError(`Ciudad fija guardada: ${currentCity}`);
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
            updateBackground(data.current.weather[0].main, data.current.dt, data.current.sys.sunrise, data.current.sys.sunset);
            if (data.current.name) localStorage.setItem("lastCity", data.current.name);
          } catch (err) {
            setError("Error al obtener el clima de tu ubicación.");
          } finally {
            setLoading(false);
          }
        },
        () => {
          // Si falla GPS, intentamos cargar lo último guardado o un ejemplo
          const savedCity = localStorage.getItem("lastCity");
          const defaultCity = "Buenos Aires";
          if (savedCity) {
            handleSearch(savedCity, { persist: false });
          } else {
            setError("Permiso de ubicación denegado. Cargando Buenos Aires como ejemplo.");
            handleSearch(defaultCity, { persist: false });
          }
        }
      );
    } else {
      const defaultCity = "Buenos Aires";
      setError("Geolocalización no disponible. Cargando Buenos Aires como ejemplo.");
      handleSearch(defaultCity, { persist: false });
    }
  };

  // Componente de Atmósfera Animada
  const WeatherAtmosphere = () => {
    if (!weather) return null;
    const condition = weather.current.weather[0].main;
    
    if (condition === "Rain" || condition === "Drizzle") {
      return [...Array(20)].map((_, i) => (
        <div key={i} className="rain-drop" style={{ left: `${Math.random() * 100}%`, animationDuration: `${0.5 + Math.random()}s`, opacity: Math.random() }} />
      ));
    }
    if (condition === "Clouds") {
      return [...Array(5)].map((_, i) => (
        <div key={i} className="cloud-mist" style={{ top: `${i * 20}%`, width: '300px', height: '150px', animationDuration: `${40 + Math.random() * 40}s`, animationDelay: `${i * -10}s` }} />
      ));
    }
    if (condition === "Clear") {
      return <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,220,100,0.15),transparent_50%)] animate-pulse" />;
    }
    return null;
  };

  useEffect(() => {
    const storedFixedCity = localStorage.getItem("fixedCity");
    const storedLastCity = localStorage.getItem("lastCity");

    if (storedFixedCity) {
      setFixedCity(storedFixedCity);
      setCurrentCity(storedFixedCity);
      handleSearch(storedFixedCity, { persist: false });
    } else if (storedLastCity) {
      setCurrentCity(storedLastCity);
      handleSearch(storedLastCity, { persist: false });
    } else {
      handleLocation(); // Arranca buscando la ubicación actual del usuario
    }
  }, []);

 return (
  <div className="w-full h-screen relative overflow-hidden flex items-center justify-center">
    {/* Capa de Imagen con Movimiento Cinematic */}
    <div 
      className="absolute inset-0 bg-cover bg-center animate-bg-pro transition-all duration-1000"
      style={{ backgroundImage: `url('${bgImage}')` }}
    />
    
    {/* Capa de Atmósfera (Lluvia, Nubes, etc) */}
    <div className="absolute inset-0 pointer-events-none z-10">
      <WeatherAtmosphere />
    </div>

    {/* Contenedor Principal */}
    <div className="relative w-full h-screen max-h-screen sm:h-auto sm:max-h-[90vh] sm:max-w-lg glass-panel sm:rounded-3xl p-4 sm:p-7 card-shadow flex flex-col justify-start overflow-y-auto overflow-x-hidden scrollbar-none animate-fade-in z-40">

    {/* Capa de degradado movida para no tapar elementos inferiores */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none z-0"></div>
      
      <header className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white drop-shadow-xl text-shadow-pro">
            MatyCar Weather <span className="text-cyan-400 font-light text-sm">Pro</span>
          </h1>
          {fixedCity && (
            <p className="text-xs text-cyan-200 mt-1">Ciudad fija: <span className="font-bold text-white">{fixedCity}</span></p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleLocation}
            className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold p-2.5 rounded-xl flex items-center gap-2 transition duration-300 shadow-lg shadow-cyan-500/30 active:scale-95 text-xs btn-glow"
          >
            📍
          </button>
          <button
            type="button"
            onClick={toggleFixedCity}
            className="bg-white/10 hover:bg-white/20 text-white font-bold p-2.5 rounded-xl transition duration-300 border border-white/10 shadow-lg shadow-white/10 active:scale-95 text-xs"
          >
            {fixedCity === currentCity ? "Liberar ciudad fija" : "Fijar ciudad actual"}
          </button>
        </div>
      </header>

      <Search onSearch={handleSearch} />

      {loading && (
        <div className="space-y-4 py-8">
          <div className="h-48 w-full bg-white/5 animate-pulse rounded-2xl"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-white/5 animate-pulse rounded-xl"></div>
            <div className="h-20 bg-white/5 animate-pulse rounded-xl"></div>
          </div>
          <p className="text-center text-cyan-300 text-xs font-bold uppercase tracking-widest animate-pulse mt-4">Sintonizando satélites...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-200 p-4 rounded-2xl text-center my-2 text-xs font-bold animate-fade-in">
          ⚠️ {error}
        </div>
      )}

      {weather && !loading && (
        <div className="space-y-6 flex-1 animate-fade-in">
          <WeatherCard current={weather.current} unit={unit} convertTemp={convertTemp} />
          <Forecast forecastList={weather.rawForecastList || weather.forecast} unit={unit} convertTemp={convertTemp} />
        </div>
      )}
    </div>

    {/* Mascota Viva - Renderizada al final para estar por encima de todo */}
    {weather && <Mascota weather={weather} />}
  </div>
);
}

export default App;
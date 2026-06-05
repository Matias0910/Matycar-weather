import React from "react";

function WeatherCard({ current, unit, convertTemp }) {
  const { name, main, weather, wind, sys, visibility } = current;
  const infoClima = weather[0];

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gradient-to-br from-white/15 to-white/5 border border-white/10 rounded-3xl p-6 text-white card-shadow relative overflow-hidden">
      {/* Decoración sutil de fondo */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
      
      {/* Encabezado: Ciudad e Ícono */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-white/5 pb-6 mb-6 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-black tracking-tighter drop-shadow-md">{name}</h2>
          <p className="text-cyan-400 capitalize font-bold text-sm mt-1 tracking-wide">{infoClima.description}</p>
        </div>
        <div className="flex items-center gap-3 bg-black/30 rounded-2xl px-5 py-2 border border-white/5">
          <img
            src={`https://openweathermap.org/img/wn/${infoClima.icon}@2x.png`}
            alt={infoClima.description}
            className="w-20 h-20 object-contain drop-shadow-2xl animate-pulse"
          />
          <span className="text-5xl font-black tracking-tighter">
            {convertTemp(main.temp)}°<span className="text-2xl font-light text-cyan-200">{unit === "metric" ? "C" : "F"}</span>
          </span>
        </div>
      </div>

      {/* Grilla de Datos Pro */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">🌡️ Max / Min</p>
          <p className="text-lg font-black text-orange-400 leading-none">{convertTemp(main.temp_max)}° / <span className="text-cyan-300">{convertTemp(main.temp_min)}°</span></p>
        </div>

        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">🥵 Sensación</p>
          <p className="text-xl font-black text-yellow-300 leading-none">{convertTemp(main.feels_like)}°</p>
        </div>

        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">💧 Humedad</p>
          <p className="text-xl font-black text-blue-400 leading-none">{main.humidity}<span className="text-xs ml-0.5">%</span></p>
        </div>

        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">💨 Viento</p>
          <p className="text-xl font-black text-teal-400 leading-none">{Math.round(unit === "metric" ? wind.speed * 3.6 : wind.speed)} <span className="text-[10px]">{unit === "metric" ? "km/h" : "mph"}</span></p>
          <div className="mt-2 text-[10px] flex items-center gap-1 text-slate-400">
            <span style={{ transform: `rotate(${wind.deg}deg)` }} className="inline-block transition-transform duration-1000">⬆️</span>
            {wind.deg}°
          </div>
        </div>

        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">👁️ Visibilidad</p>
          <p className="text-lg font-black text-white leading-none">{(visibility / 1000).toFixed(1)} <span className="text-[10px]">km</span></p>
        </div>

        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">⏲️ Presión</p>
          <p className="text-lg font-black text-white leading-none">{main.pressure} <span className="text-[10px]">hPa</span></p>
        </div>

        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">🌅 Salida</p>
          <p className="text-lg font-black text-amber-300 leading-none">{formatTime(sys.sunrise)}</p>
        </div>

        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">🌇 Puesta</p>
          <p className="text-lg font-black text-purple-400 leading-none">{formatTime(sys.sunset)}</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
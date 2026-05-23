import React from "react";

function WeatherCard({ current }) {
  const { name, main, weather, wind } = current;
  const infoClima = weather[0];

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-white shadow-xl">
      {/* Encabezado: Ciudad e Ícono */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-white/10 pb-6 mb-6 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-wide">{name}</h2>
          <p className="text-cyan-300 capitalize font-medium mt-1">{infoClima.description}</p>
        </div>
        <div className="flex items-center gap-2 bg-black/20 rounded-2xl px-4 py-2">
          <img
            src={`https://openweathermap.org/img/wn/${infoClima.icon}@2x.png`}
            alt={infoClima.description}
            className="w-16 h-16 object-contain"
          />
          <span className="text-5xl font-black">{Math.round(main.temp)}°C</span>
        </div>
      </div>

      {/* Grilla de Datos Técnicos Completos (¡TODO LO QUE PEDISTE!) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
          <p className="text-xs text-slate-300 uppercase font-semibold tracking-wider">🌡️ Max / Min</p>
          <p className="text-lg font-bold mt-1 text-orange-400">{Math.round(main.temp_max)}°C</p>
          <p className="text-sm font-medium text-cyan-300">{Math.round(main.temp_min)}°C</p>
        </div>

        <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
          <p className="text-xs text-slate-300 uppercase font-semibold tracking-wider">🥵 S. Térmica</p>
          <p className="text-xl font-black mt-2 text-yellow-300">{Math.round(main.feels_like)}°C</p>
        </div>

        <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
          <p className="text-xs text-slate-300 uppercase font-semibold tracking-wider">💧 Humedad</p>
          <p className="text-xl font-black mt-2 text-blue-300">{main.humidity}%</p>
        </div>

        <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
          <p className="text-xs text-slate-300 uppercase font-semibold tracking-wider">💨 Viento</p>
          <p className="text-xl font-black mt-2 text-teal-300">{Math.round(wind.speed * 3.6)} km/h</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
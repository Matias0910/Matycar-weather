import React from 'react';

function Forecast({ forecastData }) {
  return (
    <div className="w-full max-w-4xl mt-4">
      <h3 className="text-xl font-bold text-slate-300 mb-4 text-center md:text-left">Pronóstico de los próximos días</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {forecastData.map((day, index) => {
          const date = new Date(day.dt * 1000).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

          return (
            <div key={index} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 text-center flex flex-col items-center">
              <span className="text-sm font-semibold text-slate-400 capitalize">{date}</span>
              <img src={iconUrl} alt="clima" className="w-12 h-12 my-1" />
              <span className="text-xl font-bold text-white">{Math.round(day.main.temp)}°C</span>
              <span className="text-xs text-cyan-400/80 capitalize mt-1 line-clamp-1">{day.weather[0].description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Forecast;
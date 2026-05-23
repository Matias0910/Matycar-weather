import React from 'react';

function WeatherCard({ data }) {
  const { name, main, weather, wind } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  return (
    <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700 text-center shadow-xl mb-6">
      <h2 className="text-3xl font-bold text-white">{name}</h2>
      <p className="text-cyan-400 capitalize text-sm font-medium mt-1">{weather[0].description}</p>
      
      <div className="flex items-center justify-center my-4">
        <img src={iconUrl} alt={weather[0].description} className="w-20 h-20" />
        <span className="text-6xl font-extrabold text-white">{Math.round(main.temp)}°C</span>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700 text-slate-300 text-sm">
        <div>
          <span className="block text-slate-500 font-semibold">Sensación Térmica</span>
          <span className="text-base font-medium">{Math.round(main.feels_like)}°C</span>
        </div>
        <div>
          <span className="block text-slate-500 font-semibold">Humedad</span>
          <span className="text-base font-medium">{main.humidity}%</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
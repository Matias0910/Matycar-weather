import React from "react";

function Forecast({ forecast }) {
  // Función para transformar fechas en nombres de días ("Lun", "Mar", etc.)
  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { weekday: "short" });
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white shadow-xl">
      <h3 className="text-xl font-bold mb-4 tracking-wide text-slate-200">📅 Pronóstico Próximos Días</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div 
            key={index} 
            className="bg-black/10 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-between text-center gap-2 hover:bg-white/5 transition duration-300"
          >
            <p className="font-bold capitalize text-sm text-cyan-300">{formatDay(day.dt_txt)}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
              className="w-12 h-12"
            />
            <div>
              <p className="text-base font-black text-orange-400">{Math.round(day.main.temp_max)}°</p>
              <p className="text-xs font-medium text-slate-400">{Math.round(day.main.temp_min)}°</p>
            </div>
            <p className="text-xs capitalize text-slate-300 font-light line-clamp-1">{day.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
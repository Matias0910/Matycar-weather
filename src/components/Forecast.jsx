import React, { useState } from "react";

function Forecast({ forecastList }) {
  // 1. Agrupar los datos de la API por día real de la semana
  const daysGrouped = forecastList.reduce((acc, item) => {
    const date = item.dt_txt.split(" ")[0]; // Ej: "2026-05-24"
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  // Convertir el objeto agrupado en un Array de días útiles
  const daysArray = Object.keys(daysGrouped).map((date) => {
    const hours = daysGrouped[date];
    
    // Calcular la verdadera máxima y mínima absoluta de TODO el día entero
    const maxTemp = Math.max(...hours.map(h => h.main.temp_max));
    const minTemp = Math.min(...hours.map(h => h.main.temp_min));
    
    // Usar el clima del mediodía (o el primero que haya) para el ícono principal del día
    const midDayIcon = hours[Math.floor(hours.length / 2)] || hours[0];

    return {
      date,
      maxTemp,
      minTemp,
      icon: midDayIcon.weather[0].icon,
      description: midDayIcon.weather[0].description,
      hourlyData: hours // Guardamos las horas para el detalle de abajo
    };
  }).slice(0, 5); // Nos quedamos con los próximos 5 días

  // Estado para saber qué día seleccionó el usuario (por defecto el primero)
  const [selectedDay, setSelectedDay] = useState(daysArray[0]);

  const formatDayName = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-ES", { weekday: "long" });
  };

  const formatHour = (dateTimeStr) => {
    const time = dateTimeStr.split(" ")[1]; // Ej: "15:00:00"
    return time.substring(0, 5) + " hs"; // "15:00 hs"
  };

  return (
    <div className="space-y-6">
      {/* Selector de Días Principal */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-4 tracking-wide text-slate-200">
          📅 Pronóstico y Detalle por Hora
        </h3>
        <p className="text-xs text-slate-400 mb-4">Tocá un día para ver su itinerario y lluvias 👇</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {daysArray.map((day, index) => {
            const isSelected = selectedDay.date === day.date;
            return (
              <button
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center gap-2 transition duration-300 active:scale-95 cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/10"
                    : "bg-black/10 border-white/5 hover:bg-white/5"
                }`}
              >
                <p className="font-bold capitalize text-xs text-cyan-300">
                  {formatDayName(day.date).substring(0, 3)}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                  className="w-10 h-10"
                />
                <div>
                  <p className="text-base font-black text-orange-400">{Math.round(day.maxTemp)}°</p>
                  <p className="text-xs font-medium text-slate-400">{Math.round(day.minTemp)}°</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desglose de Horas del día seleccionado */}
      {selectedDay && (
        <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white shadow-xl animate-fadeIn">
          <h4 className="text-base font-bold mb-4 capitalize text-slate-300">
            Horarios para el <span className="text-cyan-400 font-extrabold">{formatDayName(selectedDay.date)}</span>:
          </h4>
          
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10">
            {selectedDay.hourlyData.map((hour, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center text-center min-w-[90px] gap-1"
              >
                <p className="text-xs text-slate-400 font-medium">{formatHour(hour.dt_txt)}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                  alt={hour.weather[0].description}
                  className="w-8 h-8"
                />
                <p className="text-sm font-black text-white">{Math.round(hour.main.temp)}°C</p>
                {/* Alerta de lluvia si el porcentaje de probabilidad existe o si la descripción lo dice */}
                <p className="text-[10px] font-medium capitalize text-cyan-300 line-clamp-1 mt-1">
                  {hour.weather[0].description.includes("lluvia") || hour.weather[0].description.includes("llovizna") ? "🌧️ Lluvia" : hour.weather[0].description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Forecast;
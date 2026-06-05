import React, { useState, useMemo, useEffect } from "react";

function Forecast({ forecastList, unit, convertTemp }) {
  // Memorizamos el procesamiento para evitar cálculos pesados innecesarios
  const daysArray = useMemo(() => {
    const daysGrouped = forecastList.reduce((acc, item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    return Object.keys(daysGrouped).map((date) => {
      const hours = daysGrouped[date];
      const maxTemp = Math.max(...hours.map(h => h.main.temp_max));
      const minTemp = Math.min(...hours.map(h => h.main.temp_min));
      const midDayIcon = hours[Math.floor(hours.length / 2)] || hours[0];

      return {
        date,
        maxTemp,
        minTemp,
        icon: midDayIcon.weather[0].icon,
        description: midDayIcon.weather[0].description,
        hourlyData: hours
      };
    }).slice(0, 5);
  }, [forecastList]);

  // Estado para saber qué día seleccionó el usuario (por defecto el primero)
  const [selectedDay, setSelectedDay] = useState(daysArray[0]);

  // Si los datos cambian (nueva búsqueda), volvemos a seleccionar el primer día
  useEffect(() => {
    if (daysArray.length > 0) {
      setSelectedDay(daysArray[0]);
    }
  }, [daysArray]);

  const formatDayName = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-ES", { weekday: "long" });
  };

  const formatHour = (dateTimeStr) => {
    const time = dateTimeStr.split(" ")[1]; // Ej: "15:00:00"
    return time.substring(0, 5) + " hs"; // "15:00 hs"
  };

  // Generar puntos para el gráfico SVG
  const getChartPoints = (data) => {
    if (!data || data.length < 2) return "";
    const temps = data.map(h => h.main.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = max - min || 1;
    const height = 40; // altura del gráfico en px
    return data.map((h, i) => {
      const x = i * 100 + 50; // 100px de ancho por item, centrado en 50
      const y = height - ((h.main.temp - min) / range) * height + 5;
      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      {/* Sección: Pronóstico de 5 Días (Lista Pro) */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-5 text-white card-shadow">
        <h3 className="text-lg font-black mb-4 tracking-tighter text-slate-100 flex items-center gap-2">
          📅 Pronóstico 5 Días
        </h3>
        
        <div className="flex flex-col gap-2">
          {daysArray.map((day, index) => {
            const isSelected = selectedDay.date === day.date;
            return (
              <button
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`w-full p-3.5 rounded-2xl border transition-all duration-300 active:scale-[0.98] flex items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-400/50 shadow-lg"
                    : "bg-black/20 border-white/5 hover:bg-white/5"
                }`}
              >
                <p className="font-bold capitalize text-sm text-slate-200 w-24 text-left">
                  {index === 0 ? "Hoy" : formatDayName(day.date)}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="w-12 h-12 object-contain"
                />
                <div className="flex gap-3 w-20 justify-end">
                  <span className="text-base font-black text-orange-400">{convertTemp(day.maxTemp)}°</span>
                  <span className="text-base font-bold text-slate-400">{convertTemp(day.minTemp)}°</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desglose de Horas del día seleccionado */}
      {selectedDay && (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white card-shadow animate-fade-in overflow-hidden relative">
          <h4 className="text-sm font-black mb-6 uppercase tracking-widest text-cyan-400">
            Detalle: {formatDayName(selectedDay.date)}
          </h4>
          
          <div className="relative overflow-x-auto pb-4 scrollbar-none min-h-[240px]">
            {/* Gráfico de línea Pro */}
            {selectedDay.hourlyData && selectedDay.hourlyData.length >= 2 && (() => {
              const points = getChartPoints(selectedDay.hourlyData);
              if (!points) return null;
              const lastX = (selectedDay.hourlyData.length - 1) * 100 + 50;
              return (
              <svg 
                className="absolute top-16 left-0 pointer-events-none transition-all duration-500" 
                width={selectedDay.hourlyData.length * 100} 
                height="80"
                viewBox={`0 0 ${selectedDay.hourlyData.length * 100} 80`}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(34, 211, 238, 0.3)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#chartGradient)"
                  d={`M 50,80 L ${points} L ${lastX},80 Z`}
                  className="transition-all duration-500"
                />
                <polyline
                  fill="none"
                  stroke="rgba(34, 211, 238, 0.3)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
              );
            })()}

            <div className="flex gap-3 min-w-max">
            {selectedDay.hourlyData.map((hour, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center w-[105px] gap-2 transition-all hover:bg-white/10 relative z-10"
              >
                <p className="text-[10px] text-slate-400 font-bold">{formatHour(hour.dt_txt)}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                  alt={hour.weather[0].description}
                  className="w-12 h-12 drop-shadow-lg"
                />
                <p className="text-lg font-black text-white leading-none">{convertTemp(hour.main.temp)}°</p>
                
                {/* Indicador de lluvia profesional (POP - Probability of Precipitation) */}
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hour.pop > 0 ? "bg-blue-500/20 text-blue-300" : "bg-slate-500/10 text-slate-500"}`}>
                    {hour.pop > 0 ? `💧 ${Math.round(hour.pop * 100)}%` : "0%"}
                  </span>
                  <p className="text-[9px] font-bold uppercase text-slate-400 line-clamp-1">
                    {hour.weather[0].main}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default Forecast;
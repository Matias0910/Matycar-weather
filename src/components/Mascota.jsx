import React from "react";

const Mascota = ({ weather }) => {
  if (!weather || !weather.current) return null;

  const condition = weather.current.weather[0].main;
  const temp = weather.current.main.temp;
  const isNight = weather.current.dt < weather.current.sys.sunrise || weather.current.dt > weather.current.sys.sunset;

  // Usamos CDN de JSDelivr para asegurar que las imágenes carguen siempre
  const mascotBase = "https://cdn.jsdelivr.net/gh/pablostanley/open-doodles@master/svg/";
  let mascotUrl = mascotBase + "reading.svg";
  let message = "¡Qué buen día para programar!";

  if (isNight) {
    mascotUrl = mascotBase + "sleeping.svg";
    message = "Zzz... Mañana seguimos.";
  } else if (["Rain", "Drizzle", "Thunderstorm"].includes(condition)) {
    mascotUrl = mascotBase + "groovy.svg";
    message = "¡Me encanta bailar bajo la lluvia!";
  } else if (temp > 28) {
    mascotUrl = mascotBase + "ice-cream.svg";
    message = "¡Uff, qué calor! ¿Sale un helado?";
  } else if (condition === "Clear") {
    mascotUrl = mascotBase + "chilling.svg";
    message = "Día perfecto para estar afuera.";
  } else {
    mascotUrl = mascotBase + "running.svg";
    message = "¡Aprovechemos el día!";
  }

  return (
    <div className="absolute bottom-6 left-6 z-[100] pointer-events-none transition-all duration-1000 animate-fade-in flex flex-col items-center">
      <div className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black px-4 py-2 rounded-2xl rounded-bl-none shadow-xl mb-3 animate-bounce border border-white/50 ml-12">
        {message}
      </div>

      <div className="relative flex flex-col items-center group">
        <img
          key={mascotUrl}
          src={mascotUrl}
          className="w-32 sm:w-48 h-auto animate-mascot-pro drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative z-20"
          alt="Weather Mascot"
        />
        <div className="absolute -bottom-3 w-24 h-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[100%] z-10 shadow-inner"></div>
      </div>
    </div>
  );
};

export default Mascota;
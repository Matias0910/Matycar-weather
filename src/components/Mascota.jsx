import React from "react";

const Mascota = ({ weather }) => {
  const safeWeather = weather?.current || {
    weather: [{ main: "Clear", description: "Despejado" }],
    main: { temp: 22 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      sunrise: Math.floor(Date.now() / 1000) - 3600,
      sunset: Math.floor(Date.now() / 1000) + 3600,
    },
  };

  const condition = safeWeather.weather[0].main;
  const temp = safeWeather.main?.temp || 0;
  const dt = safeWeather.dt;
  const sunrise = safeWeather.sys?.sunrise;
  const sunset = safeWeather.sys?.sunset;

  // Lógica de noche más segura
  const isNight = sunrise && sunset ? (dt < sunrise || dt > sunset) : false;

  // Usamos los SVG locales ubicados en public/mascotas
  const mascotBase = "/mascotas/";
  let mascotUrl = mascotBase + "person-professional.svg";
  let message = "¡Qué buen día para estar al aire libre!";
  let extraClass = "";

  if (isNight) {
    mascotUrl = mascotBase + "sleeping.svg";
    message = "Zzz... Mañana seguimos.";
    extraClass = "animate-pulse";
  } else if (["Rain", "Drizzle", "Thunderstorm"].includes(condition)) {
    mascotUrl = mascotBase + "umbrella.svg";
    message = "Lluvia. Agarrá el paraguas.";
    extraClass = "-translate-y-4 opacity-90";
  } else if (condition === "Snow" || temp <= 10) {
    mascotUrl = mascotBase + "snowman.svg";
    message = "Frío. Hombre de nieve listo.";
    extraClass = "animate-bounce";
  } else if (condition === "Clear") {
    mascotUrl = mascotBase + "icecream.svg";
    message = "Sol. Helado refrescante al instante.";
    extraClass = "animate-wiggle";
  } else {
    mascotUrl = mascotBase + "person-professional.svg";
    message = "Clima neutro, todo bajo control.";
  }

  return (
    <div className="fixed bottom-6 left-6 z-[999] pointer-events-none transition-all duration-1000 animate-fade-in flex flex-col items-center">
      <div className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black px-4 py-2 rounded-2xl rounded-bl-none shadow-2xl mb-3 animate-bounce border border-white/50 ml-12">
        {message}
      </div>

      <div className="relative flex flex-col items-center group">
        <img
          key={mascotUrl}
          src={mascotUrl}
          className={`w-32 sm:w-48 h-auto animate-mascot-pro drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative z-20 ${extraClass}`}
          alt="Weather Mascot"
        />

        <div className="absolute -bottom-3 w-24 h-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[100%] z-10 shadow-inner"></div>
      </div>
    </div>
  );
};

export default Mascota;
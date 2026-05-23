const API_KEY = "71364d89d80946a5051b17310ca8be62"; // <-- ¡Poné tu API Key real acá!
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getWeatherData = async (city) => {
  try {
    // 1. Clima actual
    const currentResponse = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&lang=es&appid=${API_KEY}`
    );
    if (!currentResponse.ok) throw new Error("Ciudad no encontrada");
    const currentData = await currentResponse.json();

    // 2. Pronóstico extendido
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=metric&lang=es&appid=${API_KEY}`
    );
    const forecastData = await forecastResponse.json();

    // Filtrar el pronóstico para quedarnos con un registro por día (por ejemplo, el de las 12:00 del mediodía)
    const dailyForecast = forecastData.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

   return {
  current: currentData,
  forecast: dailyForecast,
  rawForecastList: forecastData.list // <-- Agregamos esta línea mágica también
};
  } catch (error) {
    console.error("Error en la API:", error);
    throw error;
  }
};

export const getWeatherDataByCoords = async (lat, lon) => {
  try {
    const currentResponse = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    );
    if (!currentResponse.ok) throw new Error("Error con las coordenadas");
    const currentData = await currentResponse.json();

    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    );
    const forecastData = await forecastResponse.json();

    const dailyForecast = forecastData.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

    return {
  current: currentData,
  forecast: dailyForecast,
  rawForecastList: forecastData.list // <-- Agregamos esta línea mágica también
};
  } catch (error) {
    console.error("Error en geolocalización:", error);
    throw error;
  }
};
const API_KEY = "71364d89d80946a5051b17310ca8be62"; // Usamos una clave activa para agilizar hoy
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Función para obtener el clima actual por ciudad
export const getWeatherData = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
    );
    if (!response.ok) throw new Error("Ciudad no encontrada");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al traer el clima:", error);
    throw error;
  }
};

// Función para obtener el pronóstico extendido de los próximos días
export const getWeatherForecast = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`
    );
    if (!response.ok) throw new Error("Error en el pronóstico");
    const data = await response.json();
    
    // OpenWeather te da datos cada 3 horas. Filtramos para quedarnos con 1 por día
    const dailyData = data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));
    return dailyData;
  } catch (error) {
    console.error("Error al traer el pronóstico:", error);
    throw error;
  }
};
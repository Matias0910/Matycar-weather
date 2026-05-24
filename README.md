# 🌦️ Weather Dashboard - Mobile App

Aplicación móvil nativa para Android desarrollada con **React** para la interfaz de usuario y **Capacitor** para el empaquetado nativo. La app consulta datos meteorológicos en tiempo real utilizando la ubicación actual del dispositivo.

## 🚀 Características

* **Clima en Tiempo Real:** Consulta de datos climáticos basados en la ubicación del usuario.
* **Geolocalización Nativa:** Integración con los permisos de Android (`ACCESS_FINE_LOCATION`) para detectar la ubicación de forma automática.
* **Interfaz Mobile:** Diseño optimizado y limpio para pantallas de smartphones.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React (Hooks, Context API para estado global).
* **Mobile Framework:** Capacitor (Puente nativo para Android).
* **Entorno Mobile:** Android SDK, Gradle 8.11.1.

## 💻 Instalación Local

```bash
# 1. Clonar el repositorio
git clone [https://github.com/tu-usuario/weather-dashboard.git](https://github.com/tu-usuario/weather-dashboard.git)

# 2. Instalar dependencias
npm install

# 3. Compilar entorno web y sincronizar con Android
npm run build
npx cap sync android

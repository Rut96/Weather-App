const container = document.querySelector('.container');
const searchButton = document.querySelector('.search-box button');
const searchInput = document.querySelector('.search-box input');
const weatherContainer = document.querySelector('.weather-container');
const weatherImage = document.querySelector('.weather-container .weather-image');
const weatherInfo = document.querySelector('.weather-info');
const error404 = document.querySelector('.not-found');
const imageWrapper = document.querySelector('.weather-image .img-wrapper');
const weeklyForecast = document.querySelector('.weekly-forecast');
const bgVideo = document.getElementById('bgVideo');


document.addEventListener('DOMContentLoaded', () => {
    setVideoBackground('default');
    weatherImage.style.display = 'none';
});

// async function getWeatherData(city) {
//     if (city === '') return;

//     try {
//         const currentResponse = await axios.get(`https://api.weatherapi.com/v1/current.json?key=b79aa2e88f684ccdbb6124255242207&q=${city}&aqi=no`);
//         const forecastResponse = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=b79aa2e88f684ccdbb6124255242207&q=${city}&days=7&aqi=no`);
//         return {
//             current: currentResponse.data,
//             forecast: forecastResponse.data
//         };
//     } catch (error) {
//         console.error('Error fetching weather data:', error);
//         throw error;
//     }
// }


async function getWeatherData(city) {
    if (city === '') return;

    try {
        const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        
        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            throw new Error('Location not found');
        }

        const { latitude, longitude } = geoResponse.data.results[0];

        const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);

        return {
            location: geoResponse.data.results[0],
            weather: weatherResponse.data
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}


function drawWeatherUI(weatherData) {
    error404.style.display = 'none';
    error404.classList.remove('fadeIn');

    const cityName = document.querySelector('.city-name');
    const temperature = document.querySelector('.temperature');
    const description = document.querySelector('.description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');
    const feel = document.querySelector('.weather-details .feels-like span');

    cityName.innerHTML = weatherData.location.name;
    temperature.innerHTML = `${Math.round(weatherData.weather.current.temperature_2m)}<span>°C</span>`;
    description.innerHTML = getWeatherDescription(weatherData.weather.current.weather_code);
    humidity.innerHTML = `${weatherData.weather.current.relative_humidity_2m}%`;
    wind.innerHTML = `${Math.round(weatherData.weather.current.wind_speed_10m)} km/h`;
    feel.innerHTML = `${Math.round(weatherData.weather.current.temperature_2m)}°C`; 

    drawWeatherImg(getWeatherDescription(weatherData.weather.current.weather_code));
    setVideoBackground(getWeatherDescription(weatherData.weather.current.weather_code));

    weatherInfo.style.display = 'block';
    weatherInfo.classList.add('fadeIn');
    container.style.height = 'auto';

    drawWeeklyForecast(weatherData.weather.daily);

    const weatherDescription = getWeatherDescription(weatherData.weather.current.weather_code);
    description.innerHTML = weatherDescription;
    
    const animationUrl = getWeatherAnimation(weatherData.weather.current.weather_code);
    if (animationUrl.endsWith('.json')) {
        imageWrapper.innerHTML = `<lottie-player src="${animationUrl}" speed="1" style="width: 300px; height: 300px;" loop autoplay></lottie-player>`;
    } else {
        imageWrapper.innerHTML = `<img src="${animationUrl}" alt="${weatherDescription}" style="width: 300px; height: 300px;">`;
    }
}

function drawWeatherImg(currWeather) {
    currWeather = currWeather.toLowerCase();
    weatherImage.style.display = 'flex';

    if (currWeather.includes('sun') || currWeather.includes('clear')) imageWrapper.innerHTML = `<lottie-player src="https://lottie.host/bfa8abf1-8f9e-4652-96b2-48f45bda974e/fmowQid6hH.json"  speed="1"  style="width: 300px; height: 300px;" loop autoplay></lottie-player>`;
    else if (currWeather.includes('rain')) imageWrapper.innerHTML = `<lottie-player src="https://lottie.host/6998cb5a-b680-42eb-aa28-02d38d1a647e/kM1iicsqYw.json"  speed="1"  style="width: 300px; height: 300px;" loop autoplay></lottie-player>`;
    else if (currWeather.includes('snow')) imageWrapper.innerHTML = `<lottie-player src="https://lottie.host/3e5936b7-1bb4-4444-840b-25015adc59ad/G4GJ1qwrqU.json"  speed="1"  style="width: 300px; height: 300px;" loop autoplay></lottie-player>`;
    else if (currWeather.includes('cloud')) imageWrapper.innerHTML = `<lottie-player src="https://lottie.host/b09351fa-f496-437e-9627-7b137045c05a/F5ZVkrX3Nb.json"  speed="1"  style="width: 300px; height: 300px;" loop autoplay></lottie-player>`;
    else if (currWeather.includes('wind')) imageWrapper.innerHTML = `<lottie-player src="https://lottie.host/aa7440cd-1699-49cd-8999-6acdf536cdae/e0UpWv95wG.json"  speed="1"  style="width: 300px; height: 300px;" loop autoplay></lottie-player>`;
    else if (currWeather.includes('mist') || currWeather.includes('haze') || currWeather.includes('fog')) imageWrapper.innerHTML = `<lottie-player src="https://lottie.host/2e7cf8a4-4d6c-4903-b317-ffe2edaf20b1/NNowgQmoAN.json"  speed="1"  style="width: 300px; height: 300px;" loop autoplay></lottie-player>`;
    else if (currWeather.includes('storm') || currWeather.includes('thunder')) imageWrapper.innerHTML = `<lottie-player src="https://lottie.host/07ae2aeb-c1c6-40b6-8889-ce9b9da6b136/QmrkTyJLbB.json"  speed="1"  style="width: 300px; height: 300px;" loop autoplay></lottie-player>`;
    else if (currWeather.includes('overcast')) imageWrapper.innerHTML = `<lottie-player src="https://lottie.host/7522f088-d311-49a0-8775-9be0bebc8b90/l0btwdjTWO.json"  speed="1"  style="width: 300px; height: 300px;" loop autoplay></lottie-player>`;
    else imageWrapper.innerHTML = `<img src="./assets/images/default.png">`
}


function setVideoBackground(currWeather) {
    currWeather = currWeather.toLowerCase();
    let videoSrc = '';

    if (currWeather.includes('sun') || currWeather.includes('clear')) videoSrc = './assets/videos/clear.mp4';
    else if (currWeather.includes('rain')) videoSrc = './assets/videos/rain.mp4';
    else if (currWeather.includes('snow')) videoSrc = './assets/videos/snow.mp4';
    else if (currWeather.includes('cloud')) videoSrc = './assets/videos/cloudes.mp4';
    else if (currWeather.includes('mist') || currWeather.includes('haze') || currWeather.includes('fog')) videoSrc = './assets/videos/fog.mp4';
    else if (currWeather.includes('wind')) videoSrc = './assets/videos/wind.mp4';
    else if (currWeather.includes('storm') || currWeather.includes('thunder')) videoSrc = './assets/videos/storm.mp4';
    else if (currWeather.includes('overcast')) videoSrc = './assets/videos/overcast.mp4';
    else videoSrc = './assets/videos/default.mp4';

    bgVideo.src = videoSrc;
    bgVideo.load();
    // bgVideo.playbackRate = 0.75;
    bgVideo.play();
}

function drawWeeklyForecast(forecastData) {
    weeklyForecast.innerHTML = '';
    weeklyForecast.style.display = 'flex';
    weeklyForecast.style.justifyContent = 'space-between';
    weeklyForecast.style.overflowX = 'auto';
    weeklyForecast.style.padding = '1rem 0';

    for (let i = 1; i < forecastData.time.length; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');

        const date = new Date(forecastData.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const weatherDescription = getWeatherDescription(forecastData.weather_code[i]);
        const animationUrl = getWeatherAnimation(forecastData.weather_code[i]);

        let weatherIcon;
        if (animationUrl.endsWith('.json')) {
            weatherIcon = `<lottie-player src="${animationUrl}" speed="1" style="width: 50px; height: 50px;" loop autoplay></lottie-player>`;
        } else {
            weatherIcon = `<img src="${animationUrl}" alt="${weatherDescription}" style="width: 50px; height: 50px;">`;
        }

        dayElement.innerHTML = `
            <p class="forecast-day-name">${dayName}</p>
            <p class="forecast-date">${monthDay}</p>
            ${weatherIcon}
            <p class="forecast-temp">${Math.round((forecastData.temperature_2m_max[i] + forecastData.temperature_2m_min[i]) / 2)}°C</p>
            <p class="forecast-desc">${weatherDescription}</p>
        `;

        weeklyForecast.appendChild(dayElement);
    }
}

function getWeatherDescription(weatherCode) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[weatherCode] || 'Unknown';
}

function getWeatherAnimation(weatherCode) {
    const weatherDescription = getWeatherDescription(weatherCode).toLowerCase();
    
    if (weatherDescription.includes('clear') || weatherDescription.includes('sunny')) {
        return "https://lottie.host/bfa8abf1-8f9e-4652-96b2-48f45bda974e/fmowQid6hH.json";
    } else if (weatherDescription.includes('rain')) {
        return "https://lottie.host/6998cb5a-b680-42eb-aa28-02d38d1a647e/kM1iicsqYw.json";
    } else if (weatherDescription.includes('snow')) {
        return "https://lottie.host/3e5936b7-1bb4-4444-840b-25015adc59ad/G4GJ1qwrqU.json";
    } else if (weatherDescription.includes('cloud')) {
        return "https://lottie.host/b09351fa-f496-437e-9627-7b137045c05a/F5ZVkrX3Nb.json";
    } else if (weatherDescription.includes('wind')) {
        return "https://lottie.host/aa7440cd-1699-49cd-8999-6acdf536cdae/e0UpWv95wG.json";
    } else if (weatherDescription.includes('mist') || weatherDescription.includes('fog')) {
        return "https://lottie.host/2e7cf8a4-4d6c-4903-b317-ffe2edaf20b1/NNowgQmoAN.json";
    } else if (weatherDescription.includes('storm') || weatherDescription.includes('thunder')) {
        return "https://lottie.host/07ae2aeb-c1c6-40b6-8889-ce9b9da6b136/QmrkTyJLbB.json";
    } else if (weatherDescription.includes('overcast')) {
        return "https://lottie.host/7522f088-d311-49a0-8775-9be0bebc8b90/l0btwdjTWO.json";
    } else {
        return "./assets/images/default.png";
    }
}

function showError() {
    weatherInfo.style.display = 'none';
    weeklyForecast.style.display = 'none';
    weatherImage.style.display = 'none';
    error404.style.display = 'block';
    error404.classList.add('fadeIn');
    container.style.height = 'auto';

    document.querySelectorAll('.weather-details .text span').forEach(span => {
        span.textContent = '';
    });
}

function resetUI() {
    error404.style.display = 'none';
    weatherInfo.style.display = 'none';
    weeklyForecast.style.display = 'none';
    container.style.height = 'auto';
}

async function handleSearch() {
    const city = searchInput.value.trim();
    searchInput.value = "";
    if (city === '') {
        resetUI();
        return;
    }

    try {
        const weatherData = await getWeatherData(city);
        drawWeatherUI(weatherData);
    } catch (error) {
        showError();
    }
}

searchButton.addEventListener('click', handleSearch);

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

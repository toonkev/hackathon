// Place your API Key here
const weatherApiKey = '9d38ad912c185ff8ef97df4975c9cbd0';

function displayWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`)
    .then(response => response.json())
    .then(data => {
        const weatherDiv = document.getElementById('weather');
        weatherDiv.innerHTML = `
            <h2>Weather at destination:</h2>
            <p>${data.weather[0].main}</p>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind speed: ${data.wind.speed} m/s</p>
        `;
    })
    .catch(err => console.log(err));
}

fetch(`https://api.openweathermap.org/data/2.5/weather?lat=-33.8689604&lon=151.2092021&units=metric&appid=9d38ad912c185ff8ef97df4975c9cbd0`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });


fetch(`https://api.openweathermap.org/data/2.5/weather?lat=-33.8689604&lon=151.2092021&units=metric&appid=9d38ad912c185ff8ef97df4975c9cbd0`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if(data.weather) {
            console.log(data.weather[0].main);
        } else {
            console.log('Weather data not found');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });


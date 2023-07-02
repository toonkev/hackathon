// Place your API Key here

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
  



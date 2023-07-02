function displayWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`)
    .then(response => response.json())
    .then(data => {
        const weatherDiv = document.getElementById('weather');
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        let recommendation = '';
        let accessories = '';

        if (temperature < 0) {
            recommendation = '🥶 It\'s freezing outside! Layer up with a warm coat, gloves and a hat.';
            accessories = 'Don\'t forget your scarf to keep the chill away!';
        } else if (temperature < 10) {
            recommendation = '🧥 It\'s quite chilly. A good jacket and a warm sweater would be perfect.';
            accessories = 'Maybe grab a beanie and gloves just in case.';
        } else if (temperature < 20) {
            recommendation = '👕 It\'s a bit cool. A long-sleeved shirt should be fine.';
            accessories = 'You might want a light scarf if it gets windy.';
        } else {
            recommendation = '🌞 It\'s warm! T-shirts and shorts are perfect.';
            accessories = 'Don\'t forget your sunglasses!';
        }

        if (humidity > 80) {
            accessories += ' It\'s pretty humid today, so a water bottle would be a great idea.';
        } else if (humidity < 20) {
            accessories += ' The air is dry today, so don\'t forget your moisturizer!';
        }

        if (windSpeed > 8) {
            accessories += ' It\'s a bit windy, so you might want to secure your hat.';
        }

        weatherDiv.innerHTML = `
            <h2>📍Weather at destination:</h2>
            <p>🌤️ ${data.weather[0].main}</p>
            <p>🌡️ Temperature: ${temperature}°C</p>
            <p>💧 Humidity: ${humidity}%</p>
            <p>💨 Wind speed: ${windSpeed} m/s</p>
            <p>👕 What to wear: ${recommendation}</p>
            <p>🎒 What to bring: ${accessories}</p>
        `;
    })
    .catch(err => console.log(err));
}

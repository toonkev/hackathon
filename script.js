let map, directionsService, directionsRenderer, markerStart, markerEnd, flightPath;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: { lat: 41.85, lng: -87.65 }
  });

  const startInput = document.createElement("input");
  startInput.type = "text";
  startInput.id = "start";
  startInput.placeholder = "Enter a starting location";

  const endInput = document.createElement("input");
  endInput.type = "text";
  endInput.id = "end";
  endInput.placeholder = "Enter a destination";

  const modeSelect = document.createElement("select");
  modeSelect.id = "mode";
  modeSelect.options.add(new Option("Driving", "DRIVING"));
  modeSelect.options.add(new Option("Walking", "WALKING"));
  modeSelect.options.add(new Option("Bicycling", "BICYCLING"));
  modeSelect.options.add(new Option("Transit", "TRANSIT"));
  modeSelect.options.add(new Option("Flight", "FLIGHT")); // Added flight as an option

  const submitButton = document.createElement("input");
  submitButton.type = "button";
  submitButton.value = "Submit";
  submitButton.id = "submit";

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(startInput);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(endInput);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelect);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);

  submitButton.addEventListener("click", function() {
    calculateAndDisplayRoute();
  });
}

function calculateAndDisplayRoute() {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const selectedMode = document.getElementById("mode").value;

  if (directionsRenderer) directionsRenderer.setMap(null); // Remove old route if it exists
  if (flightPath) flightPath.setMap(null); // Remove old flight path if it exists

  if (selectedMode !== "FLIGHT") {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsService.route({
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode[selectedMode],
    })
      .then((response) => {
        directionsRenderer.setDirections(response);

        // Get the commute times
        const route = response.routes[0];
        const leg = route.legs[0];

        // Display the commute times
        document.getElementById("commuteTimes").textContent = `Distance: ${leg.distance.text}, Duration: ${leg.duration.text}`;

        // Call the weather API
        const destinationLatLng = leg.end_location;
        displayWeather(destinationLatLng.lat(), destinationLatLng.lng());
      })
      .catch((e) => window.alert("Directions request failed due to " + e));
  } else {
    drawFlightPath(start, end);
  }
}


// Place your API Key here
const weatherApiKey = '9d38ad912c185ff8ef97df4975c9cbd0';

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
function updateRouteInfo(origin, destination) {
  displayWeather(destination.lat, destination.lng);  // Update weather

  // Update congestion
  displayCongestion(origin, destination);
}

// congestion.js
const googleApiKey = 'AIzaSyBOaW8jvX_1FhPRdh6PbLtknj5lYBVhRMk';

function displayCongestion(origin, destination) {
  fetch(`http://localhost:3000/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`)
  .then(response => response.json())
  .then(data => {
      const congestionDiv = document.getElementById('congestion');

      if (data.status === "OK") {
          const route = data.routes[0].legs[0];

          // Get incident data, if any
          let incidents = 'No incidents reported on this route.';
          if (route.steps.some(step => step.hasOwnProperty('warnings'))) {
              incidents = 'Be aware of the following incidents on this route:<ul>'
              route.steps.forEach(step => {
                  if (step.hasOwnProperty('warnings')) {
                      incidents += `<li>${step.warnings[0]}</li>`;
                  }
              });
              incidents += '</ul>';
          }

          congestionDiv.innerHTML = `
              <h2>🚦Route Information:</h2>
              <p>🛣️ Distance: ${route.distance.text}</p>
              <p>⏱️ Duration (with current traffic): ${route.duration_in_traffic.text}</p>
              <p>⚠️ Incidents: ${incidents}</p>
          `;
      } else {
          congestionDiv.innerHTML = `<p>Couldn't fetch route information. Reason: ${data.status}</p>`;
      }
  })
  .catch(err => console.log(err));
}

function drawFlightPath(start, end) {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ 'address': start }, function (results, status) {
    if (status == 'OK') {
      const startLatLng = results[0].geometry.location;

      geocoder.geocode({ 'address': end }, function (results, status) {
        if (status == 'OK') {
          const endLatLng = results[0].geometry.location;

          flightPath = new google.maps.Polyline({
            path: [startLatLng, endLatLng],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });

          flightPath.setMap(map);
          
          // Call the weather API
          displayWeather(endLatLng.lat(), endLatLng.lng());
        } else {
          alert('Geocode for end point was not successful for the following reason: ' + status);
        }
      });
    } else {
      alert('Geocode for start point was not successful for the following reason: ' + status);
    }
  });
}

window.initMap = initMap;

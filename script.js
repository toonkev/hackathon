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

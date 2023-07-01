let map, directionsService, directionsRenderer, markerStart, markerEnd;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: { lat: 41.85, lng: -87.65 }
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

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

  const submitButton = document.createElement("input");
  submitButton.type = "button";
  submitButton.value = "Submit";
  submitButton.id = "submit";

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(startInput);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(endInput);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelect);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);

  submitButton.addEventListener("click", function() {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const selectedMode = document.getElementById('mode').value;

  directionsService.route({
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode[selectedMode]
  }, function(response, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(response);

      // Remove old markers, if any
      if (markerStart) markerStart.setMap(null);
      if (markerEnd) markerEnd.setMap(null);

      // Place a marker at the start and end points
      markerStart = new google.maps.Marker({
        position: response.routes[0].legs[0].start_location,
        map: map
      });
      markerEnd = new google.maps.Marker({
        position: response.routes[0].legs[0].end_location,
        map: map
      });
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

window.initMap = initMap;

let map, directionsService, directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: { lat: 41.85, lng: -87.65 }
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  document.getElementById('submit').addEventListener('click', function() {
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
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}


window.initMap = initMap;

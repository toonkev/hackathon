function drawFlightPath(start, end) {
    const flightPath = new google.maps.Polyline({
      path: [start, end],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
  
    flightPath.setMap(map);
  }
  
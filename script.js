function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: -25.363882, lng: 131.044922 }
  });

  var marker = new google.maps.Marker({
    position: {lat: -25.363882, lng: 131.044922 },
    map: map
  });
}

<!DOCTYPE html>
<html>
<head>
  <title>Trip Planner</title>
</head>
<body>
  <form id="tripForm">
    <label for="destination">Destination:</label><br>
    <input type="text" id="destination" name="destination"><br>
    <label for="places">Places to visit (comma separated):</label><br>
    <input type="text" id="places" name="places"><br>
    <label for="days">Number of days:</label><br>
    <input type="number" id="days" name="days"><br>
    <input type="button" value="Generate Itinerary" onclick="generateItinerary()">
  </form>
  <div id="itinerary"></div>
</body>
</html>

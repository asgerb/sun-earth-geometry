var lat = 45, 
    lon = -124,
    loc = [lat, lon];

console.log(loc);

var map = new L.Map("map");

L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
  attribution: '&copy;<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  maxZoom: 18,
  renderer: L.svg()
}).addTo(map);

map.setView([lat, lon], 8);

var locMarker = L.circleMarker(loc, 10).addTo(map);

var sunriseAzimuth = [45.25,-123],
    sunsetAzimuth = [44.25,-124],
    solarAzimuth = [4.25,-124];

var sunriseLine = L.polyline([loc, sunriseAzimuth], {
  color: "#000",
  weight: 5,
  dashArray: "5,5",  
}).addTo(map);




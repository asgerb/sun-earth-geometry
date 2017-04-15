// user inputs
var lat = 45, 
    lon = -124,
    day = 105, //days since January 1st
    solar_time = -60, // minutes from solar noon (60 min = 15 deg),
    loc = [lat, lon];

function toRad(angle) {
  return angle * (Math.PI/180);
}

function toDeg(angle) {
  return angle * (180/Math.PI);
}

function declination(day) {
  return 23.45 * Math.sin(toRad((360/365) * (284 + day)));
}

function hr_angle(solar_time){
  return 0.25 * solar_time;
}

function solar_angle(declination, hr_angle, lat) {
  var d = toRad(declination),
      h = toRad(hr_angle),
      phi = toRad(lat);
  
  return toDeg(Math.asin((Math.sin(d) * Math.sin(phi)) + (Math.cos(d) * Math.cos(h) * Math.cos(phi))));
}

function solar_azimuth(declination, hr_angle, solar_angle, lat, lon) {
  var phi = toRad(lat),
      theta = toRad(lon),
      d = toRad(declination),
      h = toRad(hr_angle),
      a = toRad(solar_angle),
      azimuth = toDeg(Math.acos(((Math.sin(d) * Math.cos(phi)) - (Math.cos(d) * Math.cos(h) * Math.sin(phi))) / Math.cos(a)));
  
  if (h > 0) {
    return 360 - azimuth;
  } else {
    return azimuth;
  }
}

//sun-earth geom results
//TO-DO:
//  + calc solar time from standard time
//  + calculate sunset and sunrise
var declination  = declination(day),
    hr_angle = hr_angle(solar_time),
    solar_angle = solar_angle(declination, hr_angle, lat),
    solar_azimuth = solar_azimuth(declination, hr_angle, solar_angle, lat, lon);

//initialize map, set baselayer and map view
var map = new L.Map("map").setView([lat, lon], 8);

L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    attribution: '&copy;<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
    renderer: L.svg()
  }).addTo(map);

//add layers
var locMarker = L.circleMarker(loc, {
  weight: 4,
  color: "#000"
}).addTo(map);

var azimuthLine = L.polyline([loc, [lat + Math.sin(toRad(90 - solar_azimuth)), lon + (Math.cos(toRad(90 - solar_azimuth)))]], {
  color: "#FF5733",
  weight: 5,
  dashArray: "4,3",  
}).addTo(map);

//add legend
var legend = L.control({position: 'topright'});

legend.onAdd = function(){
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML +="<p>location = " + loc[0] + ", " + loc[1] + "</p>";
    div.innerHTML +="<p>day = " + day + "</p>";
    div.innerHTML +="<p>solar time = " + solar_time + "</p>";
    div.innerHTML +="<p>declination = " + declination + "</p>";
    div.innerHTML +="<p>hour angle = " + hr_angle + "</p>";
    div.innerHTML +="<p>solar angle = " + solar_angle + "</p>";
    div.innerHTML +="<p>solar azimuth = " + solar_azimuth + "</p>";
    return div;
}

legend.addTo(map);











// user inputs & sun-earth geom variables
var lat = 44.568212, 
    lon = -123.280313,
    day = 105, //days since January 1st
    solar_time = 0, // minutes from solar noon (60 min = 15 deg),
    loc = [lat, lon];
var dec, hr_ang, sol_ang, sol_az;

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

function solar_angle(dec, hr_ang, lat) {
  var d = toRad(dec),
      h = toRad(hr_ang),
      phi = toRad(lat);
  
  return toDeg(Math.asin((Math.sin(d) * Math.sin(phi)) + (Math.cos(d) * Math.cos(h) * Math.cos(phi))));
}

function solar_azimuth(dec, hr_ang, sol_ang, lat, lon) {
  var phi = toRad(lat),
      theta = toRad(lon),
      d = toRad(dec),
      h = toRad(hr_ang),
      a = toRad(sol_ang),
      azimuth = toDeg(Math.acos(((Math.sin(d) * Math.cos(phi)) - (Math.cos(d) * Math.cos(h) * Math.sin(phi))) / Math.cos(a)));
  
  if (h > 0) {
    return 360 - azimuth;
  } else {
    return azimuth;
  }
}

//TO-DO:
//  + calc solar time from standard time
//  + calculate sunset and sunrise
function calcGeom() {
  dec = declination(day);
  hr_ang = hr_angle(solar_time);
  sol_ang = solar_angle(dec, hr_ang, lat);
  sol_az = solar_azimuth(dec, hr_ang, sol_ang, lat, lon);
}

calcGeom();

//initialize map, set baselayer and map view
var map = new L.Map("map").setView([lat, lon], 8);

L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
  attribution: '&copy;<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  maxZoom: 18,
  renderer: L.svg()
}).addTo(map);

//define and style legend and input controls
var legend = L.control({position: 'topright'});
var inputControl = L.control({position: 'topright'});

legend.onAdd = function(){
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML +="<p>location = " + loc[0] + ", " + loc[1] + "</p>";
  div.innerHTML +="<p>day = " + day + "</p>";
  div.innerHTML +="<p>solar time = " + solar_time + " min " + "(" + solar_time/60 + " hours)</p>";
  div.innerHTML +="<p>declination = " + dec + "</p>";
  div.innerHTML +="<p>hour angle = " + hr_ang + "</p>";
  div.innerHTML +="<p>solar angle = " + sol_ang + "</p>";
  div.innerHTML +="<p>solar azimuth = " + sol_az + "</p>";
  return div;
}

inputControl.onAdd = function() {
  var div = L.DomUtil.create('div', 'user-input-control');
  div.innerHTML += '<p>Solar Time (min)</p>'
  div.innerHTML += '<div id="time-slider"></div>';
  return div;
}

//add controls to map
legend.addTo(map);
inputControl.addTo(map);

//disable panning when using the slider input control
inputControl.getContainer().addEventListener('mouseover', function () {
    map.dragging.disable();
});
inputControl.getContainer().addEventListener('mouseout', function () {
    map.dragging.enable();
});


//define and add layers to map
var locMarker = L.circleMarker(loc, {
  weight: 4,
  color: "#000"
}).addTo(map);

var azimuthLine = L.polyline([loc, [lat + Math.sin(toRad(90 - sol_az)), lon + (Math.cos(toRad(90 - sol_az)))]], {
  color: "#ff5733",
  weight: 5,
  dashArray: "4,3",  
}).addTo(map);

//add solar time slider input
var timeSlider = document.getElementById('time-slider');

noUiSlider.create(timeSlider, {
  start: [0],
  step: 15,
  range: {
    'min': [-720],
    'max': [720]
  },
  pips: {
    mode: 'count',
    values: 5,
    density: 4
  }
});

//update azimuth and legend with slider
timeSlider.noUiSlider.on('update', function(values, handle) {
  solar_time = values[handle];
  
  calcGeom();
  
  var legend = document.getElementsByClassName('legend')[0];
  legend.innerHTML = "<p>location = " + loc[0] + ", " + loc[1] + "</p> \
                      <p>day = " + day + "</p> \
                      <p>solar time = " + solar_time + " min " + "(" + solar_time/60 + " hours)</p> \
                      <p>declination = " + dec + "</p> \
                      <p>hour angle = " + hr_ang + "</p> \
                      <p>solar angle = " + sol_ang + "</p> \
                      <p>solar azimuth = " + sol_az + "</p>";
  
  azimuthLine.setLatLngs([loc, [lat + Math.sin(toRad(90 - sol_az)), lon + (Math.cos(toRad(90 - sol_az)))]]);
  
  if (sol_ang < 0) {
    azimuthLine.setStyle({color: '#2b197f'});
  } 
  else {
    azimuthLine.setStyle({color: '#ff5733'});
  }
});











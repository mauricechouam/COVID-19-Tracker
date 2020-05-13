
// Mapbox API Call 
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhc2V5YiIsImEiOiJja2EydmhiMXIwM2Y1M2xzNW5oMnRpYzd5In0.m1vDX_9oLA_Ywa2fa43WXg';
    var map = new mapboxgl.Map({
    container: "map", // container id
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
	center: [10, 0], // starting position [lng, lat]
	zoom: 1.2 // starting zoom 
	});
	
// Add zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Add geolocate control to the map
map.addControl(
	new mapboxgl.GeolocateControl({
	positionOptions: {
	enableHighAccuracy: true
	},
	trackUserLocation: true
	})
	);

// NovelCOV-19 API Call //
var settings = {
	"url": "https://corona.lmao.ninja/v2/all",
	"method": "GET",
	"timeout": 0,
  };

$.ajax(settings).done(function (response) {
	console.log(response);
  });
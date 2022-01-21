// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  console.log("drawMap", data);
  

  // Create a map object
  var myMap = L.map("map", {
    center: [39.106667, -94.676392],
    zoom: 4
  });


  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  

  // // Loop through the data array and create one marker for each city object
  for (var i = 0; i < data.features.length; i++) {

    console.log(i);

    // Conditionals for countries points
    var tempHolder = "";
    if (data.features[i].geometry.coordinates[2] <= 2) {
      color = "#cce6ff";
    }
    else if (data.features[i].geometry.coordinates[2] > 2 && data.features[i].geometry.coordinates[2] <= 10) {
      color = "#80bfff";
    }
    else if (data.features[i].geometry.coordinates[2] > 1 && data.features[i].geometry.coordinates[2] <= 15) {
      color = "#3399ff";
    }
    else {
      color = "#0066cc";
    };
  //  console.log(data.features[i].geometry.coordinates[2]);


    // Add circles to map  L.circle([long, lat])
    L.circleMarker([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,

    // Adjust radius
      radius: data.features[i].properties.mag * 10
      
    }).bindPopup("<h2>Magnitude: " + data.features[i].properties.mag + "<h2>Depth: " + data.features[i].geometry.coordinates[2] + "</h2> <hr> <h3>Location: " + 
    data.features[i].properties.title + "</h3>").addTo(myMap);


    // Call the updateLegend function, which will... update the legend!

    // updateLegend(circleColor);

  }

});

function drawMap(data) { 
};
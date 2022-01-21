// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


// Create the tile layer that will be the background of our map
basicMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
maxZoom: 18,
id: "mapbox/streets-v11", 
accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
MINOR: new L.LayerGroup(),
MODERATE: new L.LayerGroup(),
SERIOUS: new L.LayerGroup(),
MAJOR: new L.LayerGroup(),
};

// Create the map with our layers
var map = L.map("map", {
  center: [39.106667, -94.676392],
  zoom: 4,
  layers: [
      layers.MINOR, 
      layers.MODERATE,
      layers.SERIOUS,
      layers.MAJOR
  ]
});

// Add our 'basicMap' tile layer to the map
basicMap.addTo(map);


// // Create an overlays object to add to the layer control
var overlays = {
    "Minor": layers.MINOR,
    "Moderate": layers.MODERATE,
    "Serious": layers.SERIOUS,
    "Major": layers.MAJOR
    };

//  Create a control for layers, add overlay layers to it
    L.control.layers(null, overlays).addTo(map);

//  Create a legend to display information about our map
    var info = L.control({
    position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
    };

  // Add the info legend to the map
    info.addTo(map);

// So far, have just made map, now perform a GET request to the query URL & put data int json
d3.json(queryUrl).then(function(data) {

  drawMap(data);
})

function drawMap(data) {

    // Create an object to keep of the number of earthquakes in each category
    var earthquakeCount = {
        MINOR: 0,
        MODERATE: 0,
        SERIOUS: 0,
        MAJOR: 0
    };

    // Initialize a variable to track the depth of the current earthquake
    var depthLevel; 

    // Loop through all earthquakes ... 
    for (var i = 0; i < data.features.length; i++) {

        // ... get the current earthquake depth
        var currentDepth = (data.features[i].geometry.coordinates[2]); 

        // ... define its severity
        if(data.features[i].geometry.coordinates[2] <= 2) {
        depthLevel = "MINOR"
        }

        else if (data.features[i].geometry.coordinates[2] > 2 && data.features[i].geometry.coordinates[2] <= 10) {
        depthLevel = "MODERATE";
        }

        else if (data.features[i].geometry.coordinates[2] > 10 && data.features[i].geometry.coordinates[2] <= 15) {
        depthLevel = "SERIOUS";
        }

        else {
        depthLevel = "MAJOR";
        }

        // ... increment the appropriate count
        earthquakeCount[depthLevel]++; 

        
        
        // Assign color based on earthquake depth 
        var color = "";
        if (data.features[i].geometry.coordinates[2] <= 2) {
          color = "#87CEFA";
        }
        else if (data.features[i].geometry.coordinates[2] > 2 && data.features[i].geometry.coordinates[2] <= 10) {
          color = "#1E90FF";
        }
        else if (data.features[i].geometry.coordinates[2] > 10 && data.features[i].geometry.coordinates[2] <= 15) {
          color = "#0000FF";
        }
        else {
          color = "#DC143C";
        };


        // ... create a circleMarker
        var newCircle = L.circleMarker([data.features[i].geometry.coordinates[1], 
            data.features[i].geometry.coordinates[0]], {
            color: [color], 
            radius: data.features[i].properties.mag * 10
        }); 


        newCircle.bindPopup("<h2>Magnitude: " + data.features[i].properties.mag + 
            "<h2>Depth: " + data.features[i].geometry.coordinates[2] + "</h2> <hr> <h3>Location: " + 
            data.features[i].properties.title + "</h3>")

        // ... and add it to the appropriate layer
        newCircle.addTo(layers[depthLevel]);    
    }

    // Call the updateLegend function, which will... update the legend!
    updateLegend(earthquakeCount);

    // Update the legend's innerHTML with the latest count of earthquakes
    function updateLegend(earthquakeCount) {
    document.querySelector(".legend").innerHTML = [
        "<p class='MINOR'>Minor: " + earthquakeCount.MINOR + "</p>",
        "<p class='MODERATE'>Moderate: " + earthquakeCount.MODERATE + "</p>",
        "<p class='SERIOUS'>Serious: " + earthquakeCount.SERIOUS + "</p>",
        "<p class='MAJOR'>Major: " + earthquakeCount.MAJOR + "</p>"
    ].join("");
    };

}

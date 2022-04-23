// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});


function getColor(depth){
    if(depth < 10){
        return "#77FF33"
        }
    else if(depth<30){
        return "#6EAD2A"
    }
    else if (depth <50){
            return "#F6F92F"
    }
    else if (depth <70){
        return "#F9AC2F"
    }
    else if (depth <90){
        return "#F9471B"
    } 
    else {
        return "#5D1200"
    }
    };
 function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><p>Location: ${(feature.properties.place)}</p><p>Depth: ${(feature.geometry.coordinates[2])} km</p>`);
    }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
       onEachFeature: onEachFeature,
       pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
          radius: feature.properties.mag*4,
          fill0pacity: 0.5,
          stroke: true,
          color: 'black',
          weight: 1,
          fillColor: getColor(feature.geometry.coordinates[2])
        })
      }
    });
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}
function createMap(earthquakes) {
  
var gray = L.tileLayer('https://maps.omniscale.net/v2/private-bryan-mangrum-0af0fa70/style.grayscale/{z}/{x}/{y}.png',{
attribution: "©️ <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> ©️ <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
});


var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Categories</strong>'];
    example = [9,15,40,60,80,99];
    categories = ['< 10','10 - 30','30 - 50','50 - 70','70 - 90', '90+'];

for (var i = 0; i < categories.length; i++) {
     div.innerHTML += 
    labels.push(
        '<i class="circle" style="background:' + getColor(example[i] + 1) + '"></i> ' +
    (categories[i] ? categories[i] : '+'));
    
    }

      div.innerHTML = labels.join('<br>');
  return div;
};



  // Create our map, giving it the streetmap and earthquakes layers to display on load.
var myMap = L.map("map", {
    center: [
    37.09, -95.71
    ],
    zoom: 5,
    });

 gray.addTo(myMap);
 earthquakes.addTo(myMap);
 legend.addTo(myMap);
  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  //L.control.layers(overlayMaps, {
  //  collapsed: false
 // }).addTo(myMap);

}

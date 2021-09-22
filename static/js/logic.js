// Establishing our 7-day earthquake data URL
var URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
// Query the URL
d3.json(URL, function(data) {
    console.log(data)
    createFeatures(data.features);
});
function createFeatures(earthquakeData) {
    function onEachLayer(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          radius: circleSize(feature.properties.mag),
          fillOpacity: 0.8,
          color: getColor(feature.properties.mag),
          fillColor: getColor(feature.properties.mag)
        });
      }

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }
function createMap(earthquakes) {

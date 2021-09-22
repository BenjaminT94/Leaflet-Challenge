// Establishing our 7-day earthquake data URL
var URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
// Query the URL
d3.json(URL, function(data) {
    console.log(data)
    createFeatures(data.features);
});


let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"


d3.json(url).then(function (data) {

    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    function magnitudecolor(depth){
        if (depth <= 10 ) {
            return "#B4B8AA"
        }
        else if (depth <= 30) {
            return "#B8B8AA"
        }
       
        else if (depth <= 50) {
            return "#B8B3AA"
        }
      
        else if (depth <= 70) {
            return "#B8B1AA"
        }
        
        else if (depth <= 90) {
            return "#B8AAAA"
        }
        else {
            return "#ADB8AA"
        }
    }

    function style(data) {
        return {
          // Using default opacity and fill opacity
            opacity: 0.5,
            fillOpacity: 0.5,
            fillColor: magnitudecolor(data.geometry.coordinates[2]),
            color: "#000000",
            // Making sure the radius will scale
            radius: data.properties.mag * 7,
            weight: 0.5
        }
    }


    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}
      </p><hr><p>Magnitude: ${feature.properties.mag} | Depth: ${feature.geometry.coordinates[2]}</p>`);
    }


    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlong) {
            return L.circleMarker(latlong)
        },
      onEachFeature: onEachFeature,
      style: style
    });
    

    createMap(earthquakes);
  
}
function createMap(earthquakes) {


    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  

    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  

    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
// Creating map variable and adjusting the layers 
    var myMap = L.map("map", {
      center: [
        35.7128, -90.0059
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    // Set up the legend, depth, and colors, assigning the legend to be at the bottom right
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function (map) { 
      let div = L.DomUtil.create('div', 'info legend'),
      depth = [-10,10,30,50,70,90];
      colors = ["#B4B8AA","#B8B8AA","#B8B3AA","#B8B1AA","#B8AAAA","#ADB8AA","#ADB9AA"];

      for (var i = 0; i < depth.length; i++) {
        div.innerHTML += "<i style= 'background: " + colors[i] + "'></i> " + depth[i] + (depth[i + 1] ? "&ndash;" + depth[ i + 1] + "<br>" : "+");
        }
        return div;
        };

    // Adding legend to the map
    legend.addTo(myMap)
}
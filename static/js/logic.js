
let queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"


d3.json(queryurl).then(function (data) {

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
            opacity: 0.5,
            fillOpacity: 0.5,
            fillColor: magnitudecolor(data.geometry.coordinates[2]),
            color: "#000000",
            radius: data.properties.mag * 3,
            weight: 0.7
        }
    }


    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}
      </p><hr><p>Magnitude: ${feature.properties.mag} | Depth: ${feature.geometry.coordinates[2]}</p>`);
    }


    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng)
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
  

    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
      // Add legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];
    
      div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
  for (var i =0; i < depth.length; i++) {
    div.innerHTML += 
    '<i style="background:' + magnitudecolor(depth[i] + 1) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
    return div;
  };
  legend.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);



}
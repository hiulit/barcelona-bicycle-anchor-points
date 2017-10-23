var map,
    geojson,
    geojsonFiltered;

var radiusCircle = new L.circle();
var markersLayer = new L.LayerGroup();

var tileLayerUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
var tileLayerAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';
var tileLayerInstance = new L.tileLayer(tileLayerUrl, {
    attribution: tileLayerAttribution,
    detectRetina: true,
    id: 'mapbox.streets',
    maxZoom: 20
});

var radius = document.getElementById('select')[document.getElementById('select').selectedIndex].value;

var myLocation = new L.latLng(41.386664, 2.1675844);

function onLocationFound(e) {
    myLocation = e.latlng;
    var locationRadius = e.accuracy / 2;

    L.marker(myLocation).addTo(map)
        .bindPopup("You are within " + locationRadius + " meters from this point").openPopup();

    L.circle(myLocation, locationRadius).addTo(map);

    applyRadius(radius);
}

function onLocationError(e) {
    alert(e.message);
}

function filterGeoJSON(type, value) {
    var featureCollection = {
        "type": "FeatureCollection",
        "crs": {
          "type": "name",
          "properties": {
            "name": "EPSG:25831"
          }
        },
        "features": []
    }

    if (type == 'max') {
        for (var i=0; i<value; i++) {
            featureCollection.features.push(geojson.features[i]);
        }
    }

    return featureCollection;
}

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.NOM_EQUIP) {
        layer.bindPopup(feature.properties.NOM_EQUIP);
    }
}

function getSelectedRadius() {
    var select = document.getElementById('select');
    var value = select[select.selectedIndex].value;
    radius = value;
    applyRadius(radius);
}

function applyRadius(radius) {
    markersLayer.clearLayers();

    radiusCircle
        .setLatLng(myLocation)
        .setRadius(radius)
        .setStyle({
            // color: '#000000',
            fillOpacity: 0.4,
            opacity: 1,
            weight: 1
    }).addTo(markersLayer);

    // geojsonFiltered = filterGeoJSON('max', 10);

    if (geojsonFiltered) {
        geojson = geojsonFiltered;
    }

    L.Proj.geoJson(geojson, {
        pointToLayer: function(geoJsonPoint, latlng) {
            if (myLocation.distanceTo(latlng) < radius) {
                return L.marker(latlng);
            }
        },
        // filter: function(geoJsonFeature) {
        //     return geoJsonFeature.properties.DIST == "Gràcia";
        // },
        onEachFeature: onEachFeature
    }).addTo(markersLayer);

    // L.geoJson(features, {
    //     filter: function(feature, layer) {
    //         return myLocation.distanceTo(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])) < RADIUS;
    //     },
    //     onEachFeature: onEachFeature
    // }).addTo(markersLayer);

    markersLayer.addTo(map);
}

map = L.map('map', {
    layers: [tileLayerInstance]
}).setView([41.386664, 2.1675844], 12);

proj4.defs("EPSG:25831", "+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({
    maxZoom: 16,
    setView: true
});

document.getElementById('select').addEventListener('change', getSelectedRadius);
// getSelectedRadius();

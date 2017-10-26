var markersLayer = new L.LayerGroup();
var myLocation = new L.latLng(41.386664, 2.1675844);
var myLocationCircle = new L.circle();
var myLocationMarker = new L.marker();
var radiusCircle = new L.circle();

var radiusOptions = [
    100,
    200,
    300
]

var loading = document.getElementById('loading');

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

var map = L.map('map', {
    layers: [tileLayerInstance]
}).setView(myLocation, 12);

function onLocationFound(e) {
    var myLocationRadius = Math.round(e.accuracy / 2);
    myLocation = e.latlng;

    loading.classList.remove('is-showing');

    myLocationMarker
        .setLatLng(myLocation)
        .bindPopup("You are within " + myLocationRadius + " meters from this point")
        .openPopup()
    .addTo(map);

    myLocationCircle
        .setLatLng(myLocation)
        .setRadius(myLocationRadius)
    .addTo(map);

    getSelectedRadius();
}

function onLocationError(e) {
    loading.classList.remove('is-showing');
    alert(e.message);
}

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.NOM_EQUIP) {
        layer.bindPopup(feature.properties.NOM_EQUIP);
    }
}

function getSelectedRadius() {
    var radiusSelect = document.getElementById('radius-select');
    var radius = radiusSelect[radiusSelect.selectedIndex].value;
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

    markersLayer.addTo(map);
}

function getMyLocation() {
    markersLayer.clearLayers();
    map.removeLayer(myLocationCircle);
    map.removeLayer(myLocationMarker);
    map.removeLayer(radiusCircle);
    loading.classList.add('is-showing');
    map.locate({
        maxZoom: 16,
        setView: true
    });
}

proj4.defs("EPSG:25831", "+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Creates location button.
L.Control.Location = L.Control.extend({
    onAdd: function(map) {
        var container = L.DomUtil.create('div',
                'leaflet-control-locate leaflet-bar leaflet-control');

        var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
        link.href = '#';
        link.id = 'get-my-location';
        link.title = 'Get my location';
        link.setAttribute('role', 'button');
        link.setAttribute('aria-label', link.title);

        var icon = L.DomUtil.create('img', '', link);
        icon.src = './assets/ic_my_location_black_24px.svg';
        icon.style.height = '30px';
        icon.style.width = '20px';

        L.DomEvent
            .addListener(container, 'click', L.DomEvent.stop)
            .addListener(container, 'click', getMyLocation)
        L.DomEvent.disableClickPropagation(container);

        return container;
    },
    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.location = function(opts) {
    return new L.Control.Location(opts);
}

L.control.location({
    position: 'topleft'
}).addTo(map);

// Creates radius select.
L.Control.Select = L.Control.extend({
    onAdd: function(map) {
        var container = L.DomUtil.create('div',
                'leaflet-control-radius-select leaflet-bar leaflet-control');

        var title = L.DomUtil.create('div', 'leaflet-control-radius-select__title', container);
        title.textContent = 'Select radius';

        var select = L.DomUtil.create('select', 'leaflet-control-radius-select__select', container);
        select.id = 'radius-select';
        select.name = 'radius-select';

        for (i=0; i<radiusOptions.length; i++){
            var option = L.DomUtil.create('option', '', select)
            option.value = radiusOptions[i];
            option.text = radiusOptions[i] + ' m';
        }

        L.DomEvent
            .addListener(select, 'change', L.DomEvent.stop)
            .addListener(select, 'change', getSelectedRadius);
        L.DomEvent.disableClickPropagation(container);

        return container;
    },
    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.select = function(opts) {
    return new L.Control.Select(opts);
}

L.control.select({
    position: 'topright'
}).addTo(map);

// (function(cl){
//     console.log = function() {
//     if (window.allowConsole)
//         cl(...arguments);
//     }
// })(console.log)

// window.allowConsole = true;

var tileLayerUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';

var tileLayerAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';

var tileLayerInstance = new L.tileLayer(tileLayerUrl, {
    accessToken: APIKeys.mapBoxToken,
    attribution: tileLayerAttribution,
    detectRetina: true,
    id: 'mapbox/streets-v11',
    maxZoom: 20,
    tileSize: 512,
    zoomOffset: -1,
});

var leafletDefaultIcon = L.Icon.extend({
    options: {
        iconUrl: './assets/marker-icon-default.svg',
        shadowUrl: './assets/marker-icon-shadow.svg',
        iconSize: [48, 48],
        shadowSize: [24, 14],
        iconAnchor: [24, 46],
        shadowAnchor: [1, 14]
    }
});

var defaultIcon = new leafletDefaultIcon();

var leafletUserIcon = L.Icon.extend({
    options: {
        iconUrl: './assets/marker-icon-purple.svg',
        shadowUrl: './assets/marker-icon-shadow.svg',
        iconSize: [48, 48],
        shadowSize: [24, 14],
        iconAnchor: [24, 46],
        shadowAnchor: [1, 14]
    }
});

var userIcon = new leafletUserIcon();

var map = L.map('map', {
    layers: [tileLayerInstance]
}).setView(mapHelper.userPosition, 12);

proj4.defs("EPSG:25831", "+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

map.on('locationfound', mapHelper.onLocationFound);
map.on('locationerror', mapHelper.onLocationError);

var mapMoveEndFlag = false
var mapMoveFlag = false

function toggleMapMove() {
    if (!mapMoveFlag) {
        return;
    }
    else {
        mapHelper.markersLayer.clearLayers();
        mapHelper.userPositionMarker.setLatLng(map.getCenter());
    }
}

function toggleMapMoveEnd() {
    if (!mapMoveEndFlag) {
        return;
    }
    else {
        mapHelper.userPosition = map.getCenter();
        mapHelper.addRadiusAndMarkers();
    }
}

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

        for (i=0; i<mapHelper.radiusOptions.length; i++){
            var option = L.DomUtil.create('option', '', select)
            option.value = mapHelper.radiusOptions[i];
            option.text = mapHelper.radiusOptions[i] + ' m';
        }

        L.DomEvent
            .addListener(select, 'change', L.DomEvent.stop)
            .addListener(select, 'change', mapHelper.addRadiusAndMarkers);
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

var myLocationButton = L.easyButton({
    states: [
        {
            icon: 'icon icon--my-location',
            onClick: function() {
                toggleButton.state('toggle-on');
                mapMoveFlag = false
                mapMoveEndFlag = false
                mapHelper.clearAllLayers();
                mapHelper.getUserLocation();
            }
        }
    ]
});
myLocationButton.addTo(map);

// Toggle button
var toggleButton = L.easyButton({
    states: [
        {
            icon: 'icon icon--location',
            onClick: function(control) {
                control.state('toggle-off');
                mapHelper.userRadius = 0;
                mapHelper.userPosition = map.getCenter();
                mapHelper.addRadiusAndMarkers();
                mapMoveFlag = true;
                map.on('move', toggleMapMove);
                mapMoveEndFlag = true;
                map.on('moveend', toggleMapMoveEnd)
            },
            stateName: 'toggle-on'
        },
        {
            icon: 'icon icon--back',
            onClick: function(control) {
                control.state('toggle-on');
                mapMoveFlag = false;
                mapMoveEndFlag = false;
                mapHelper.clearAllLayers();
            },
            stateName: 'toggle-off'
        }
    ]
});
toggleButton.addTo(map);

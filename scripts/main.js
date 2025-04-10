// (function(cl){
//     console.log = function() {
//     if (window.allowConsole)
//         cl(...arguments);
//     }
// })(console.log)

// window.allowConsole = true;

var tileLayerUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

var tileLayerAttribution =
  'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
  'GeoJSON <a href="https://portaldades.ajuntament.barcelona.cat/ca/microdades/6778b87d-da09-4eb8-9504-5c9ae5fbfad9">Open Data BCN</a> <a href="https://creativecommons.org/licenses/by/4.0/">(CC BY 4.0)</a>';

var tileLayerInstance = new L.tileLayer(tileLayerUrl, {
  prefix: "",
  attribution: tileLayerAttribution,
  detectRetina: true,
  maxZoom: 20,
  // tileSize: 512,
  // zoomOffset: -1,
});

var leafletDefaultIcon = L.Icon.extend({
  options: {
    iconUrl: "./assets/marker-icon-default.svg",
    shadowUrl: "./assets/marker-icon-shadow.svg",
    iconSize: [48, 48],
    shadowSize: [24, 14],
    iconAnchor: [24, 46],
    shadowAnchor: [1, 14],
  },
});

var defaultIcon = new leafletDefaultIcon();

var leafletUserIcon = L.Icon.extend({
  options: {
    iconUrl: "./assets/marker-icon-purple.svg",
    shadowUrl: "./assets/marker-icon-shadow.svg",
    iconSize: [48, 48],
    shadowSize: [24, 14],
    iconAnchor: [24, 46],
    shadowAnchor: [1, 14],
  },
});

var userIcon = new leafletUserIcon();

var map = L.map("map", {
  layers: [tileLayerInstance],
}).setView(mapHelper.userPosition, 16);

proj4.defs(
  "EPSG:25831",
  "+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);

map.on("locationfound", mapHelper.onLocationFound);
map.on("locationerror", mapHelper.onLocationError);

var mapMoveEndFlag = false;
var mapMoveFlag = false;

function toggleMapMove() {
  if (!mapMoveFlag) {
    return;
  } else {
    mapHelper.markersLayer.clearLayers();
    mapHelper.userPositionMarker.setLatLng(map.getCenter());
  }
}

function toggleMapMoveEnd() {
  if (!mapMoveEndFlag) {
    return;
  } else {
    mapHelper.userPosition = map.getCenter();
    mapHelper.addRadiusAndMarkers();
  }
}

// Creates radius select.
L.Control.Select = L.Control.extend({
  onAdd: function (map) {
    var container = L.DomUtil.create(
      "div",
      "leaflet-control-radius-select leaflet-bar leaflet-control"
    );

    var title = L.DomUtil.create(
      "div",
      "leaflet-control-radius-select__title",
      container
    );
    title.textContent = "Select radius";

    var select = L.DomUtil.create(
      "select",
      "leaflet-control-radius-select__select",
      container
    );
    select.id = "radius-select";
    select.name = "radius-select";
    select.title = "Select search radius in meters";
    select.setAttribute("aria-label", select.title);

    for (i = 0; i < mapHelper.radiusOptions.length; i++) {
      var option = L.DomUtil.create("option", "", select);
      option.value = mapHelper.radiusOptions[i];
      option.text = mapHelper.radiusOptions[i] + " m";
    }

    L.DomEvent.addListener(select, "change", L.DomEvent.stop).addListener(
      select,
      "change",
      mapHelper.addRadiusAndMarkers
    );
    L.DomEvent.disableClickPropagation(container);

    return container;
  },
  onRemove: function (map) {
    // Nothing to do here
  },
});

L.control.select = function (opts) {
  return new L.Control.Select(opts);
};

L.control
  .select({
    position: "topright",
  })
  .addTo(map);

var myLocationButton = L.easyButton({
  states: [
    {
      icon: "icon icon--my-location",
      title: "Get my location",
      onClick: function () {
        toggleButton.state("toggle-on");
        mapMoveFlag = false;
        mapMoveEndFlag = false;
        mapHelper.clearAllLayers();
        mapHelper.getUserLocation();
      },
      stateName: "get-my-location",
    },
  ],
});
myLocationButton.addTo(map);

var toggleButton = L.easyButton({
  states: [
    {
      icon: "icon icon--location",
      title: "Set my location",
      onClick: function (control) {
        control.state("toggle-off");
        mapHelper.userRadius = 0;
        mapHelper.userPosition = map.getCenter();
        mapHelper.addRadiusAndMarkers();
        mapMoveFlag = true;
        map.on("move", toggleMapMove);
        mapMoveEndFlag = true;
        map.on("moveend", toggleMapMoveEnd);
      },
      stateName: "toggle-on",
    },
    {
      icon: "icon icon--back",
      title: "Go back",
      onClick: function (control) {
        control.state("toggle-on");
        mapMoveFlag = false;
        mapMoveEndFlag = false;
        mapHelper.clearAllLayers();
      },
      stateName: "toggle-off",
    },
  ],
});
toggleButton.addTo(map);

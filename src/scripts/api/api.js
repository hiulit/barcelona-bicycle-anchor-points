var defaults = {
    position: {
        lat: 41.386664,
        lng: 2.1675844
    }
}

var mapHelper = {
    initialPosition: new L.latLng(defaults.position),
    markersLayer: new L.LayerGroup(),
    radiusCircle: new L.circle(),
    radiusOptions: [100, 200, 300],
    userPosition: new L.latLng(defaults.position),
    userPositionCircle: new L.circle(),
    userPositionMarker: new L.marker(),
    userRadius: 0,
    addRadiusAndMarkers: function() {
        mapHelper.clearAllLayers();
        mapHelper.addAnchorsCircle();
        mapHelper.addAnchorsMarkers();
        mapHelper.addUserPositionCircle();
        mapHelper.addUserPositionMarker();
        mapHelper.markersLayer.addTo(map);
    },
    addAnchorsCircle: function() {
        mapHelper.radiusCircle
            .setLatLng(mapHelper.userPosition)
            .setRadius(mapHelper.getSelectedRadius())
            .setStyle({
                fillOpacity: 0.4,
                opacity: 1,
                weight: 1
        }).addTo(mapHelper.markersLayer);
    },
    addAnchorsMarkers: function() {
        console.log('Selected radius:', mapHelper.getSelectedRadius());
        apiHelper.getNearestAnchors(mapHelper.userPosition, mapHelper.getSelectedRadius());
    },
    addUserPositionCircle: function() {
        mapHelper.userPositionCircle
            .setLatLng(mapHelper.userPosition)
            .setRadius(mapHelper.userRadius)
        .addTo(mapHelper.markersLayer);
    },
    addUserPositionMarker: function() {
        mapHelper.userPositionMarker
            .setIcon(userIcon)
            .setLatLng(mapHelper.userPosition)
            .bindPopup("You are within " + mapHelper.userRadius + " meters from this point")
            .openPopup()
        .addTo(mapHelper.markersLayer);
    },
    clearAllLayers: function() {
        console.log('All layers cleared!');
        mapHelper.markersLayer.clearLayers();
    },
    getSelectedRadius: function() {
        var radiusSelect = document.getElementById('radius-select');
        var radius = radiusSelect[radiusSelect.selectedIndex].value;
        return Number(radius);
    },
    getUserLocation: function() {
        if (!navigator.geolocation) {
            alert('Geolocation is not available!');
        } else {
            mapHelper.clearAllLayers();
            mapHelper.loading(true);
            map.locate({
                maxZoom: 16,
                setView: true
            });
        }
    },
    loading: function(show) {
        var el = document.getElementById('loading');
        if (show == true) {
            console.log('Showing loader...');
            el.classList.add('is-visible')
        } else if (show == false) {
            console.log('Loader removed!');
            el.classList.remove('is-visible')
        }
    },
    onLocationFound: function(e) {
        mapHelper.userPosition = new L.latLng(e.latlng.lat, e.latlng.lng);
        mapHelper.userRadius = Math.round(e.accuracy / 2);
        console.log('User\'s position:', mapHelper.userPosition);
        console.log('User\'s radius:', mapHelper.userRadius);
        mapHelper.loading(false);
        mapHelper.addRadiusAndMarkers();
    },
    onLocationError: function(e) {
        mapHelper.loading(false);
        alert(e.message);
    }
}

var apiHelper = {
    url: './data/barcelona-bicycle-anchors.json',
    getJSON: function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var res = xhr.responseText;
                    callback(JSON.parse(res));
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (e) {
          console.error(xhr.statusText);
        };
        xhr.send(null);
    },
    getFeaturesProperties: function() {
        apiHelper.getJSON(apiHelper.url, function(data){
            var array = [];
            for (var i=0; i<data.features.length; i++) {
                var keys = Object.keys(data.features[i].properties);
                for (var j=0; j<keys.length; j++) {
                    if (array.indexOf(keys[j]) == -1) {
                        array.push(keys[j]);
                    }
                }
            }
            console.log('Feature properties', array);
            return array;
        });
    },
    getFeatureProperty: function(key) {
        apiHelper.getJSON(apiHelper.url, function(data){
            var array = [];
            for (var i=0; i<data.features.length; i++) {
                if (array.indexOf(data.features[i].properties[key]) == -1) {
                    array.push(data.features[i].properties[key]);
                }
            }
            console.log('Feature property', array);
            return array;
        });
    },
    getAnchorsByFeatureProperty: function(key, value) {
        apiHelper.getJSON(apiHelper.url, function(data){
            var array = [];
            mapHelper.clearAllLayers();
            L.Proj.geoJson(data, {
                pointToLayer: function(geoJsonPoint, latlng) {
                    array.push(latlng);
                    return L.marker(latlng);
                },
                filter: function(geoJsonFeature) {
                    return geoJsonFeature.properties[key] == value;
                },
                onEachFeature: apiHelper.onEachFeature
            }).addTo(mapHelper.markersLayer);
            console.log('Anchors by feature property', array);
            mapHelper.markersLayer.addTo(map);
        });
    },
    getNearestAnchors: function(position, radius) {
        if (!position || !radius) {
            console.log('This function needs the user\'s position and a radius!');
            return
        }
        position = new L.latLng(position);
        apiHelper.getJSON(apiHelper.url, function(data){
            var array = [];
            L.Proj.geoJson(data, {
                pointToLayer: function(geoJsonPoint, latlng) {
                    if (position.distanceTo(latlng) < radius) {
                        array.push(latlng);
                        return L.marker(latlng);
                    }
                },
                onEachFeature: apiHelper.onEachFeature
            }).addTo(mapHelper.markersLayer);
            console.log('Nearest anchors:', array);
            mapHelper.markersLayer.addTo(map);
        });
    },
    onEachFeature: function(feature, layer) {
        if (feature.properties && feature.properties.NOM_EQUIP) {
            layer.bindPopup(feature.properties.NOM_EQUIP);
        }
    }
}

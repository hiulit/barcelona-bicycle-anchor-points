# Barcelona bycicle anchors points

Find public bicycle anchor points near you in Barcelona!

## API

### mapHelper

* [mapHelper.initialPosition](#initialposition)
* [mapHelper.loading.hide()](#)
* [mapHelper.loading.show()](#)
* [mapHelper.markersLayer](#markerslayer)
* [mapHelper.radiusCircle](#radiuscircle)
* [mapHelper.radiusOptions](#radiusoptions)
* [mapHelper.userPosition](#userposition)
* [mapHelper.userPositionCircle](#userpositioncircle)
* [mapHelper.userPositionMarker](#userpositionmarker)
* [mapHelper.userRadius](#userradius)
* [mapHelper.getUserLocation()](#getuserlocation)

#### initialPosition

The center of Barcelona.

`{ lat: 41.386664, lng: 2.1675844 }`

#### loading.show()

Shows loading animation.

#### loading.hide()

Hides loading animation.

### markersLayer

`new L.LayerGroup()`

### radiusCircle

`new L.circle()`

#### radiusOptions

Radius' values in meters.

`[ 100, 200, 300]`

#### userPosition

Gets the user position when [location is found](#onlocationfound).

[initialPosition](#initialposition) by default.

#### userPositionCircle

`new L.circle()`

#### userPositionMarker

`new L.marker()`

#### userRadius

Gets the user's radius when [location is found](#onlocationfound).

`null` by default

#### getUserLocation()

Finds user's location and centers the map.

#### onLocationFound(e)

Gets user's position and radius and shows it on the map.

#### onLocationError(e)

Shows an alert when position is not found or user's denies using geolocation.

#### getSelectedRadius()

Gets the value from the radius select.

#### addRadiusAndMarkers()

#### addUserPositionMarker()

#### addUserPositionCircle()

#### addRadiusMarkers()

#### addRadiusCircle()

#### clearAllLayers()

### apiHelper

#### url

`https://raw.githubusercontent.com/hiulit/barcelona-bicycle-anchor-points/master/dist/assets/bcn-bike-anchors-pretty.json`

#### getJSON(url, callback)

#### getFeatureProperties()

Get all the feature properties.

#### getFeatureProperty(property)

Get

### getAnchorByFeatureProperty(property, value)

### getNearestAnchors(position, radius)

## Changelog

### v1.0.0 (October 23rd 2017)

* Released stable version.

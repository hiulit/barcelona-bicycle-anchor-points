# mapHelper

* [initialPosition](#initialposition)
* [loading.hide()](#loadingshow)
* [loading.show()](#loadinghide)
* [markersLayer](#markerslayer)
* [radiusCircle](#radiuscircle)
* [radiusOptions](#radiusoptions)
* [userPosition](#userposition)
* [userPositionCircle](#userpositioncircle)
* [userPositionMarker](#userpositionmarker)
* [userRadius](#userradius)
* [addRadiusAndMarkers()](#addradiusandmarkers)
* [addRadiusCircle()](#addradiuscircle)
* [addRadiusMarkers()](#addradiusmarkers)
* [addUserPositionCircle()](#adduserpositioncircle)
* [addUserPositionMarker()](#adduserpositionmarker)
* [clearAllLayers()](#clearalllayers)
* [getSelectedRadius()](#getselectedradius)
* [getUserLocation()](#getuserlocation)
* [onLocationError()](#onlocationerror)
* [onLocationFound()](#onlocationfound)

## initialPosition

The center of Barcelona.

`{ lat: 41.386664, lng: 2.1675844 }`

## loading.show()

Shows loading animation.

## loading.hide()

Hides loading animation.

## markersLayer

`new L.LayerGroup()`

## radiusCircle

`new L.circle()`

## radiusOptions

Radius' values in meters.

`[ 100, 200, 300]`

## userPosition

Gets the user position when [location is found](#onlocationfound).

[initialPosition](#initialposition) by default.

## userPositionCircle

`new L.circle()`

## userPositionMarker

`new L.marker()`

## userRadius

Gets the user's radius when [location is found](#onlocationfound).

`null` by default

## getUserLocation()

Finds user's location and centers the map.

## onLocationFound()

Gets user's position and radius and shows it on the map.

## onLocationError()

Shows an alert when position is not found or user's denies using geolocation.

## getSelectedRadius()

Gets the value from the radius select.

## addRadiusAndMarkers()

## addUserPositionMarker()

## addUserPositionCircle()

## addRadiusMarkers()

## addRadiusCircle()

## clearAllLayers()

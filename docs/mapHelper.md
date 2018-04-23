# mapHelper

* [initialPosition](#initialposition)
* [markersLayer](#markerslayer)
* [userPositionMarkerLayer](#userpositionmarkerlayer)
* [radiusCircle](#radiuscircle)
* [radiusOptions](#radiusoptions)
* [userPosition](#userposition)
* [userPositionCircle](#userpositioncircle)
* [userPositionMarker](#userpositionmarker)
* [userRadius](#userradius)
* [addRadiusAndMarkers()](#addradiusandmarkers)
* [addAnchorsCircle()](#addanchorscircle)
* [addAnchorsMarkers()](#addanchorsmarkers)
* [addUserPositionCircle()](#adduserpositioncircle)
* [addUserPositionMarker()](#adduserpositionmarker)
* [clearAllLayers()](#clearalllayers)
* [getSelectedRadius()](#getselectedradius)
* [getUserLocation()](#getuserlocation)
* [loading(show)](#loadingshow)
* [onLocationError()](#onlocationerrore)
* [onLocationFound()](#onlocationfounde)

## initialPosition

Returns a `LatLng` object with coordinates (Barcelona's city center).

### Parameters

| Name | Type | Description |
| :---: | :---: | :---: |
| - | - | - |

### Output

| Type | Description |
| --- | --- |
| `Object` | `LatLng` object: `{ lat: Number, lng: Number }` |

### Example

`mapHelper.initialPosition`

## markersLayer

Creates a new layer group object.

http://leafletjs.com/reference-1.2.0.html#layergroup

This layer group is used to store all the markers but the user's position marker.

### Example

`mapHelper.markersLayer`

## userPositionMarkerLayer

Creates a new layer group object.

http://leafletjs.com/reference-1.2.0.html#layergroup

This layer group is used to store only the user's position marker.

### Example

`mapHelper.userPositionMarkerLayer`

## radiusCircle

Creates a new circle object.

http://leafletjs.com/reference-1.2.0.html#circle

### Example

`mapHelper.radiusCircle`

## radiusOptions

Returns an `Array` of numbers.

### Parameters

| Name | Type | Description |
| :---: | :---: | :---: |
| - | - | - |

### Output

| Type | Description |
| --- | --- |
| `Array` | numbers |

### Example

`mapHelper.radiusOptions`

## userPosition

Returns a `LatLng` object with coordinates. [initialPosition](#initialposition) by default.

### Parameters

| Name | Type | Description |
| :---: | :---: | :---: |
| - | - | - |

### Output

| Type | Description |
| --- | --- |
| `Object` | `LatLng` object: `{ lat: Number, lng: Number }` |

### Example

`mapHelper.userPosition`

## userPositionCircle

Creates a new circle object (to be used as radius for the user's position).

http://leafletjs.com/reference-1.2.0.html#circle

### Example

`mapHelper.userPositionCircle`

## userPositionMarker

Creates a new circle object (to be used as a marker for the user's position).

http://leafletjs.com/reference-1.2.0.html#marker

### Example

`mapHelper.userPositionMarker`

## userRadius

Returns the user's radius when [location is found](#onlocationfounde).

### Example

`mapHelper.userRadius`

## addRadiusAndMarkers()

Calls:

* [mapHelper.clearAllLayers()](#clearalllayers)
* [mapHelper.addAnchorsCircle()](#addanchorscircle)
* [mapHelper.addAnchorsMarkers()](#addanchorsmarkers)
* [mapHelper.addUserPositionCircle()](#adduserpositioncircle)
* [mapHelper.addUserPositionMarker()](#adduserpositionmarker)

## addAnchorsMarkers()

Calls [apiHelper.getNearestAnchors](../apiHelper.md/#getnearestanchorsposition-radius).

### Example

`mapHelper.addAnchorsMarkers()`

## addAnchorsCircle()

Creates a circle with the user's position and radius  and adds it to [mapHelper.markersLayer](#markerslayer).

### Example

`mapHelper.addAnchorsCircle()`

## addUserPositionMarker()

Creates a marker with the user's position and adds it to [mapHelper.markersLayer](#markerslayer).

### Example

`mapHelper.addUserPositionMarker()`

## addUserPositionCircle()

Creates a circle with the user's position and radius and adds it to [mapHelper.markersLayer](#markerslayer).

### Example

`mapHelper.addUserPositionCircle()`

## clearAllLayers()

Removes all the layers from [mapHelper.markersLayer](#markerslayer).

### Example

`mapHelper.clearAllLayers()`

## loading(show)

Shows/hides loading animation.

### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `show` | `Boolean` | `true` or `false` |

### Output

| Type | Description |
| :---: | --- |
| - | Shows/hides loading animation |

### Example

`mapHelper.loading(true)`

## getSelectedRadius()

Returns the value from the radius select.

### Example

`mapHelper.getSelectedRadius()`

## getUserLocation()

Finds user's location and centers the map.

### Example

`mapHelper.getUserLocation()`

## onLocationError(e)

Shows an alert when position is not found or user denies geolocation services.

## onLocationFound(e)

Returns user's position and radius and shows it on the map.

// Filter geoJSON
function filterGeoJSON (type, value) {
    var featureCollection = {
        type: 'FeatureCollection',
        crs: {
            type: 'name',
            properties: {
                name: 'EPSG:25831'
            }
        },
        features: []
    }

    if (type == 'max') {
        for (var i = 0; i < value; i++) {
            featureCollection.features.push(geojson.features[i])
        }
    }

    return featureCollection
}

// Example
var geojsonFiltered = filterGeoJSON('max', 10)

if (geojsonFiltered) {
    geojson = geojsonFiltered
}

// getJSON
var geoJSON1 =
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=410925.4640611075,4559315.863154193,430493.3433021126,4578883.7423951990'
var geoJSON2 =
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=410925.4640611075,4578883.742395198,430493.3433021126,4598451.62163620350'
var geoJSON3 =
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=430493.3433021121,4559315.863154193,450061.2225431172,4578883.7423951990'
var geoJSON4 =
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=430493.3433021121,4578883.742395198,450061.2225431172,4598451.62163620350'

function getJSON (url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://galvanize-cors-proxy.herokuapp.com/' + url, true)
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var res = xhr.responseText
                // Executes your callback with the
                // response already parsed into JSON
                callback(JSON.parse(res))
            } else {
                console.error(xhr.statusText)
            }
        }
    }

    xhr.onerror = function (e) {
        console.error(xhr.statusText)
    }

    // Send the request to the server
    xhr.send(null)
}

// Example
getJSON(geoJSON1, function (data) {
    console.log(data)
})

const async = require('async')
const fs = require('fs')
const iconv = require('iconv-lite')
const merge = require('deepmerge')
const path = require('path')
const progressBar = require('node-progress-3')
const request = require('request')

let URLArray = [
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=420709.4036816098,4569099.802774696,430493.34330211236,4578883.7423951980',
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=420709.4036816098,4578883.742395198,430493.34330211236,4588667.68201570',
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=420709.4036816098,4588667.6820157,430493.34330211236,4598451.6216362030',
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=430493.3433021121,4569099.802774696,440277.28292261466,4578883.7423951980',
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=430493.3433021121,4578883.742395198,440277.28292261466,4588667.68201570',
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=430493.3433021121,4588667.6820157,440277.28292261466,4598451.6216362030'
]

let JSONArray = []
let JSONOutput = 'src/data/barcelona-bicycle-anchors.json'
let JSONMerge

let bar = new progressBar({
    complete: '=',
    format: 'Downloading JSON (:current/' + URLArray.length + ') [:bar] :percent',
    incomplete: ' ',
    total: URLArray.length,
    width: 20
})

let q = async.queue(function (task, done) {
    request.get({
        url: task.url,
        json: true,
        encoding: null
    }, function(err, res, body) {
        if (err) return done(err)
        if (res.statusCode != 200) return done(res.statusCode)
        body = iconv.decode(body, 'UTF-16')
        JSONArray.push(JSON.parse(body))
        bar.tick()
        done()
    })
}, 5)

q.drain = function() {
    console.log('Merging JSON ...')
    JSONMerge = merge.all(JSONArray)
    console.log('\033[1;32mAll JSON merged successfully!\033[0m')

    fs.writeFile(JSONOutput, JSON.stringify(JSONMerge, null, 4), function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log('\nJSON saved to "' + JSONOutput + '"')
        }
    })
}

async.eachOf(URLArray, function(url, index, callback) {
    q.push({
        url: url,
        index: index
    })
})

bar.onComplete = function() {
    console.log('\n\033[1;32mDownload complete.\033[0m\n')
    // process.exit()
}

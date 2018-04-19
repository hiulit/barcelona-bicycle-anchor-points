const async = require('async')
const fs = require('fs')
const iconv = require('iconv-lite')
const merge = require('deepmerge')
const path = require('path')
const progressBar = require('node-progress-3')
const request = require('request')

let URLArray = [
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=410925.4640611075,4559315.863154193,430493.3433021126,4578883.7423951990',
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=410925.4640611075,4578883.742395198,430493.3433021126,4598451.62163620350',
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=430493.3433021121,4559315.863154193,450061.2225431172,4578883.7423951990',
    'https://w33.bcn.cat/planolBCN/mapserv.ashx?ccapa=K021&lang=CA&layer=EQUIPS_GUIA&VERSION=1.0.0?&th=4&request=GetFeature&TYPENAME=K021&SERVICE=WFS&maxfeatures=2000&OUTPUTFORMAT=application/json&&bbox=430493.3433021121,4578883.742395198,450061.2225431172,4598451.62163620350'
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
    console.log('\033[1;32mAll JSON merged succesfully!\033[0m')

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

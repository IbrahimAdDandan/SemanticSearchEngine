//const request = require('request');
//const Expand = require('./expand/expand');
//const expand = new Expand();
/*
request.get({
    url: 'https://www.wordsapi.com/mashape/words/language/synonyms?when=2018-05-27T19:25:49.564Z&encrypted=8cfdb282e722969be89607bee658bcbcaeb4240935f993b8'
}, function (err, httpResponse, body) {
    console.log(body);
    console.log(err);
});
*/
/*
const w = ['java', 'examples', 'php', 'language'];
let query = expand.expandArray(w);
query.then((q) => {
    console.log('in the final then branch');
    console.log('the final query is: ' + q);
}).catch((er) => {
    console.log('in the catch branch');
    console.log(er);
});
*/

var napa = require('napajs');
var zone1 = napa.zone.create('zone1', {
    workers: 4
});

// Broadcast code to all 4 workers in 'zone1'.
//zone1.broadcast('console.log("hello world");');

// Execute an anonymous function in any worker thread in 'zone1'.
zone1.execute(
        (text) => text, ['hello napa'])
    .then((result) => {
        console.log(result.value);
    });
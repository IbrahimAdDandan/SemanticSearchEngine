const request = require('request');
const convert = require('xml-js');

class Fuseki {

    constructor(dataset) {
        this.dataset = dataset;
        this.url = 'http://localhost:3030/' + this.dataset + '/sparql';
        this.updateURL = 'http://localhost:3030/' + this.dataset + '/update';
    }

    getXMLTriples(query, callback) {

        request.post({
            url: this.url,
            form: {
                query: query
            }
        }, function (err, httpResponse, body) {
            callback(err, httpResponse, body, next);
        });

    }

    getJSONTriples(query, getCallback) {

        request.post({
            url: this.url,
            form: {
                query: query
            }
        }, function (err, httpResponse, body) {
            if (!err) {
                const jsonRes = convert.xml2js(body, {
                    compact: true,
                    spaces: 2,
                    ignoreDeclaration: true,
                    ignoreComment: true,
                    ignoreCdata: true,
                    ignoreDoctype: true
                });
                getCallback(err, httpResponse, jsonRes);
            } else {
                getCallback(err, httpResponse, body);
            }

        });

    }

    insertTriple(query, callback) {
        request.post({
            url: this.updateURL,
            form: {
                update: query
            }
        }, function (err, httpResponse, body) {
            callback(err, httpResponse, body);
        });
    }

}

module.exports = Fuseki;
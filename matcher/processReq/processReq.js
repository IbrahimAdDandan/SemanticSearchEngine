const Fuseki = require('../fuseki/fuseki');
const InitQuery = require('../initQuery/initQuery');
const Expand = require('../expand/expand');
const expand = new Expand();
const initQuery = new InitQuery();
const dataset = 's3e';
const fuseki = new Fuseki(dataset);


class ProcessReq {

    constructor() {}

    /**
     * search after expanded the user query semantical without lexical.
     * @param {*} req HTTP request comming from the frontend.
     * @param {*} res HTTP response to the frontend.
     */
    searchSemantic(req, res) {

        const before = Date.now();
        console.log(req.body);
        let sparqlQuery = initQuery.construct(req.body.query);
        console.log(sparqlQuery);

        fuseki.getJSONTriples(sparqlQuery, (err, httpResponse, body) => {
            if (err) {
                console.log(err);
            } else {
                //console.dir(body);
                if (!Object.keys(body.sparql.results).length) {
                    console.log('not found');
                    let tElapsed = parseFloat(Date.now() - before);
                    console.log('time elapsed: ' + tElapsed);
                    body.sparql.results.timeElapsed = tElapsed;
                    res
                        .status(404)
                        .json(body.sparql.results);
                } else {
                    console.log('found :)');
                    let tElapsed = parseFloat(Date.now() - before);
                    console.log('time elapsed: ' + tElapsed);
                    body.sparql.results.timeElapsed = tElapsed;
                    res
                        .status(200)
                        .json(body.sparql.results);
                }
            }

        });
    }

    /**
     * search after expanded the user query semantical and lexical.
     * @param {*} req HTTP request comming from the frontend.
     * @param {*} res HTTP response to the frontend.
     */
    searchSemanticLexical(req, res) {
        const before = Date.now();
        console.log(req.body);
        if (req.body.query) {
            let w = req.body.query.split(' ');
            if (w) {
                let query = expand.expandArray(w);
                query.then((q) => {
                    //console.log('the final query is: ' + q);
                    let sparqlQuery = initQuery.construct(req.body.query + ' ' + q);
                    console.log(sparqlQuery);
                    fuseki.getJSONTriples(sparqlQuery, (err, httpResponse, body) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //console.dir(body);
                            if (!Object.keys(body.sparql.results).length) {
                                console.log('not found');
                                let tElapsed = parseFloat(Date.now() - before);
                                console.log('time elapsed: ' + tElapsed);
                                body.sparql.results.timeElapsed = tElapsed;
                                res
                                    .status(404)
                                    .json(body.sparql.results);
                            } else {
                                console.log('found :)');
                                let tElapsed = parseFloat(Date.now() - before);
                                console.log('time elapsed: ' + tElapsed);
                                body.sparql.results.timeElapsed = tElapsed;
                                res
                                    .status(200)
                                    .json(body.sparql.results);
                            }
                        }

                    });
                });
            }
        }
    }

    /**
     * Multi threaded search after expanded the user query semantical without lexical.
     * @param {*} req HTTP request comming from the frontend.
     */
    threadedSearch(req) {

        const before = Date.now();
        console.log(req.body);
        let sparqlQuery = initQuery.construct(req.body.query);
        console.log(sparqlQuery);
        let response = {
            status: 200,
            result: {}
        };
        fuseki.getJSONTriples(sparqlQuery, (err, httpResponse, body) => {
            if (err) {
                console.log(err);
            } else {
                //console.dir(body);
                if (!Object.keys(body.sparql.results).length) {
                    console.log('not found');
                    let tElapsed = parseFloat(Date.now() - before);
                    console.log('time elapsed: ' + tElapsed);
                    body.sparql.results.timeElapsed = tElapsed;
                    response.status = 404;
                    response.result = body.sparql.results;
                    return response;
                } else {
                    console.log('found :)');
                    let tElapsed = parseFloat(Date.now() - before);
                    console.log('time elapsed: ' + tElapsed);
                    body.sparql.results.timeElapsed = tElapsed;
                    response.status = 200;
                    response.result = body.sparql.results;
                    return response;
                }
            }

        });
        
    }

}

module.exports = ProcessReq;
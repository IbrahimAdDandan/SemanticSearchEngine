const Fuseki = require('../fuseki/fuseki');
const stem = require('wink-porter2-stemmer');

class Indexer {

    constructor(ontoPrefix, dataset) {
        this.ontoPrefix = ontoPrefix;
        this.dataset = dataset;
        this.fuseki = new Fuseki(dataset);
        this.count = 0;
    }

    lowerAndTrim(x) {
        if (x) {
            return x.replace(/^\s+|\s+$|,|;|&|\+|\\|\'|:|!|\?/gm, '').toLowerCase();
        }
        return x;
    }

    trimWord(x) {
        if (x) {
            return x.replace(/^\s+|\s+$|,|;|&|\+|\\|\'|:|!|\?/gm, '');
        }
        return x;
    }

    indexing(data) {
        //console.log(data);
        /**
         * algorithm:
         * 1    devide content to array of words
         * 2    foreach word
         * 3        toLowerCase(word)
         * 4        if it found in the ontology
         * 5            annotate:
         * 6                ns:word ns:in-title 'url'
         */
        return new Promise((resolve, reject) => {
            //for (let i = 0; i < data.length; i++) {
                //console.log(data[i]);
                let url = 'http://'+data.hostname+data.page;
                let content = data.anchor_text;
                let text = data.text;
                let title = data.title;
                let words = content.split(" ");
                //console.log(words);
                for (let j = 0; j < words.length; j++) {
                    if (words[j] != undefined) {
                        let word = this.lowerAndTrim(stem(words[j]));
                        console.log(word);
                        let query = this.ontoPrefix + ' SELECT * WHERE {{ ns:' + word + ' ?p ?o } UNION { ?s ?p ns:' + word + '}}';
                        this.fuseki.getJSONTriples(query, (err, httpResponse, body) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                //console.dir(body);
                                if (!Object.keys(body.sparql.results).length) {
                                    console.log('not found');
                                    resolve('not found :(');
                                } else {
                                    console.log('found :)');
                                    let relation = 'in_title';
                                    let insertQuery = this.ontoPrefix + ' INSERT { ns:' + word + ' ns:' + relation + ' "' + url + '" } WHERE {}';
                                    this.fuseki.insertTriple(insertQuery, (error, response, returned) => {
                                        if (error) {
                                            console.log(error);
                                            reject(error);
                                        } else {
                                            //console.log('the triple was inserted :)' + returned);
                                            console.log('the triple was inserted :)');
                                            resolve('the triple was inserted :)');
                                        }
                                    });
                                }
                            }
    
                        });
                    }
                }
                for (let j = 1; j < words.length; j++) {
                    if (words[j-1] != '' && words[j] != '') {
                        const tempArray = [this.lowerAndTrim(stem(words[j-1])), this.lowerAndTrim(stem(words[j]))];
                        const word = tempArray.join('_');
                        console.log(word);
                        let query = this.ontoPrefix + ' SELECT * WHERE {{ ns:' + word + ' ?p ?o } UNION { ?s ?p ns:' + word + '}}';
                        this.fuseki.getJSONTriples(query, (err, httpResponse, body) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                //console.dir(body);
                                if (!Object.keys(body.sparql.results).length) {
                                    console.log('not found');
                                } else {
                                    console.log('found :)');
                                    let relation = 'in_title';
                                    let insertQuery = this.ontoPrefix + ' INSERT { ns:' + word + ' ns:' + relation + ' "' + url + '" } WHERE {}';
                                    this.fuseki.insertTriple(insertQuery, (error, response, returned) => {
                                        if (error) {
                                            console.log(error);
                                            reject(error);
                                        } else {
                                            //console.log('the triple was inserted :)' + returned);
                                            console.log('the triple was inserted :)');
                                            resolve('the triple was inserted :)');
                                        }
                                    });
                                }
                            }
    
                        });
                    }
                }
            //}
        });
        
    }

    indexingv(data) {
        return new Promise((resolve, reject) => {
                let url = data.url;
                let content;
                if (data.title) {
                    content = data.title;
                } else if (data.part) {
                    content = data.part;
                } else {
                    //console.log('there is no valid content!');
                    reject('there is no valid content!');
                }
                let text = data.text;
                let words = content.split(" ");
                //console.log(words);
                for (let j = 0; j < words.length; j++) {
                    if (words[j] != undefined) {
                        let word = this.lowerAndTrim(stem(words[j]));
                        console.log(word);
                        let query = this.ontoPrefix + ' SELECT * WHERE {{ ns:' + word + ' ?p ?o } UNION { ?s ?p ns:' + word + '}}';
                        this.fuseki.getJSONTriples(query, (err, httpResponse, body) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                //console.dir(body);
                                if (!Object.keys(body.sparql.results).length) {
                                    //console.log('not found');
                                    resolve('not found :(');
                                } else {
                                    console.log('found :)');
                                    let relation = 'in_title';
                                    let insertQuery = this.ontoPrefix + ' INSERT { ns:' + word + ' ns:' + relation + ' "' + url + '" } WHERE {}';
                                    this.fuseki.insertTriple(insertQuery, (error, response, returned) => {
                                        if (error) {
                                            console.log(error);
                                            reject(error);
                                        } else {
                                            //console.log('the triple was inserted :)' + returned);
                                            console.log('the triple was inserted :)');
                                            resolve('the triple was inserted :)');
                                        }
                                    });
                                }
                            }
    
                        });
                    }
                }
                for (let j = 1; j < words.length; j++) {
                    if (words[j-1] != '' && words[j] != '') {
                        const tempArray = [this.lowerAndTrim(stem(words[j-1])), this.lowerAndTrim(stem(words[j]))];
                        const word = tempArray.join('_');
                        console.log(word);
                        let query = this.ontoPrefix + ' SELECT * WHERE {{ ns:' + word + ' ?p ?o } UNION { ?s ?p ns:' + word + '}}';
                        this.fuseki.getJSONTriples(query, (err, httpResponse, body) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                //console.dir(body);
                                if (!Object.keys(body.sparql.results).length) {
                                    console.log('not found');
                                } else {
                                    console.log('found :)');
                                    let relation = 'in_title';
                                    let insertQuery = this.ontoPrefix + ' INSERT { ns:' + word + ' ns:' + relation + ' "' + url + '" } WHERE {}';
                                    this.fuseki.insertTriple(insertQuery, (error, response, returned) => {
                                        if (error) {
                                            console.log(error);
                                            reject(error);
                                        } else {
                                            //console.log('the triple was inserted :)' + returned);
                                            console.log('the triple was inserted :)');
                                            resolve('the triple was inserted :)');
                                        }
                                    });
                                }
                            }
    
                        });
                    }
                }
            //}
        });
        
    }

}

module.exports = Indexer;
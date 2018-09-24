const stem = require('wink-porter2-stemmer');

class InitQuery {

    constructor() {
        this.query = '';
        this.ontoPrefix = 'PREFIX ns: <http://www.semanticweb.org/myonto#> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>';
    }

    /**
     * it take a single word, trim white spaces and special charechters and return it.
     * @param {String} x 
     */
    lowerAndTrim(x) {
        if (x) {
            return x.replace(/^\s+|\s+$|,|;|!|\.|\?/gm, '').toLowerCase();
        }
        return x;
    }

    /**
     * function construct and return a sparql query from the the user query string.
     * @param {String} queryString 
     */
    construct(queryString) {
        let content = queryString;
        let words = content.split(" ");
        for (let j = 0; j < words.length; j++) {
            words[j] = this.lowerAndTrim(stem(words[j]));
        }
        this.query = this.ontoPrefix + ' SELECT DISTINCT ?o WHERE ';
        if (words.length > 0) {
            this.query += '{ ';
        }
        this.query += ' { ?s rdf:type ns:' + words[0] + ' . ?s ns:in_title ?o . } ';
    
        for (let j = 1; j < words.length; j++) {
            //let word = this.lowerAndTrim(stem(words[j]));
            this.query += ' UNION { ?s rdf:type ns:'+words[j]+' . ?s ns:in_title ?o . } ';
    
        }
    
        for (let j = 1; j < words.length; j++) {
            const tempArray = [words[j - 1], words[j]];
            const word = tempArray.join('_');
            this.query += ' UNION { ns:' + word + ' ns:in_title ?o } ';
        }
    
        for (let j = 1; j < words.length; j++) {
            const tempArray = [words[j - 1], words[j]];
            const word = tempArray.join('_');
            this.query += ' UNION { ?s rdf:type ns:'+word+' . ?s ns:in_title ?o . } ';
        }
        /**
         * SELECT *
            WHERE {
                ns:word1 ns:word2 ?s .
                ?s ns:in_title ?o .
            }
            javascript framework -> angular, vuejs...
         */
        for (let j = 1; j < words.length; j++) {
            this.query += ' UNION { ns:' + words[j-1] + ' ns:'+words[j]+' ?s . ?s ns:in_title ?o . } ';
        }
    
        for (let j = 0; j < words.length; j++) {
            this.query += ' UNION { ns:' + words[j] + ' ns:in_title ?o } ';
    
        }
    
        if (words.length > 0) {
            this.query += ' }';
        }
        return this.query;
    }


}

module.exports = InitQuery;
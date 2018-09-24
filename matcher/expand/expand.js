const request = require('request');

class Expand {
    constructor() {
        this.query = '';
    }

    /**
     * return array of Synonyms of the word in a callback function.
     * @param {String} word 
     * @param {function} cb
     */
    expandQuery(word, cb) {
        request.get({
            url: 'https://www.wordsapi.com/mashape/words/' + word + '/synonyms?when=2018-05-27T19:25:49.564Z&encrypted=8cfdb282e722969be89607bee658bcbcaeb4240935f993b8'
        }, function (err, httpResponse, body) {
            if (err) {
                console.log(err);
            } else {
                cb(body);
            }
        });
    }

    /**
     * return a promise for an array of the word's synonyms.
     * @param {String} word 
     */
    promiseExpandWord(word) {
        return new Promise((resolve, reject) => {
            request.get({
                url: 'https://www.wordsapi.com/mashape/words/' + word + '/synonyms?when=2018-05-27T19:25:49.564Z&encrypted=8cfdb282e722969be89607bee658bcbcaeb4240935f993b8'
            }, function (err, httpResponse, body) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    }

    /**
     * return a promise string containing all synonyms of words in the array.
     * @param {[String]} wordsArray 
     */
    /*
    async promiseExpandArray(wordsArray) {
        let promises = [];
        wordsArray.forEach(w => {
            promises.push(new Promise((resolve, reject) => {
                this.promiseExpandWord(wordsArray[i]);
            }));
        });
        try {
            let results = await Promise.all(promises);
            if(results) {
                results = results.map(body => JSON.parse(body).synonyms).join(' ');
                return result;
            }
        }
        catch(e) {
            // throw error here 
        }
    }
    */

    /**
     * return a promise string containing all synonyms of words in the array.
     * @param {[String]} wordsArray 
     */
    expandArray(wordsArray, i = 0) {
        let result;
        return new Promise((resolve, reject) => {
            if (i == (wordsArray.length)) {
                console.log('the resolved query is: ' + this.query);
                resolve(this.query);
            } else {
                result = this.promiseExpandWord(wordsArray[i]);
                result
                    .then((body) => {
                        let parsed = JSON.parse(body);
                        let syn = parsed.synonyms;
                        if (syn) {
                            this.query += syn.join(' ') + ' ';
                        }
                        console.log('query now is: ' + this.query + 'and i: ' + i);
                        let f = this.expandArray(wordsArray, i + 1);
                        f.then((q) => {
                            resolve(q);
                        });
                    })
                    .catch((er) => {
                        reject(er);
                    });
            }
        });
    }

}

module.exports = Expand;
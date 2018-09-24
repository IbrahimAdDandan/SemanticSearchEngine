const mysql = require('mysql');

class Connecting {

    /**
     * Initialization the connection to the database.
     * @param {String} host the database host, 'localhost' for default. 
     * @param {String} user the username credintials, 'root' for default.
     * @param {String} password the password credintials, '' for default.
     * @param {String} database the database name that containes the crawled data, default value is 'ows_index'.
     */
    constructor(host = 'localhost', user = 'root', password='', database='ows_index') {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
    }

    /**
     * connect to the database.
     */
    connect() {
        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        });

        this.connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }

            console.log('connected as id ' + this.connection.threadId);
        });
    }

    /**
     * return a promise to the crawled data.
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT `hostname`, `page`, `title`, `anchor_text`, `text` FROM `pages` WHERE `host_id` IN (1,5)', (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    fetchVideo () {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT `hostname`, `page`, `text` FROM `pages` WHERE `host_id` = 2', (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = Connecting;
const Connecting = require('./dbConnect');
const connecting = new Connecting();
const amqp = require('amqplib/callback_api');
var youtubedl = require('youtube-dl');
const vttToJson = require("vtt-json");
const fs = require('fs');

const options = {
    // Write automatic subtitle file (youtube only)
    auto: true,
    // Downloads all the available subtitles.
    all: false,
    // Languages of subtitles to download, separated by commas.
    lang: 'en',
    // The directory to save the downloaded files in.
    cwd: __dirname
};

connecting.connect();
connecting
    .fetchVideo()
    .then((results) => {
        //console.log(results);
        for (let i = 0; i < results.length; i++) {
            let url = 'https://' + results[i].hostname + results[i].page;
            youtubedl.getInfo(url, (err, info) => {
                if (err) throw err;

                console.log('title:', info.title);
                let msg = {
                    title: info.title,
                    url: url
                };
                youtubedl.getSubs(url, options, (err, files) => {
                    if (err) throw err;

                    console.log('subtitle files downloaded:', files);
                    let sub = fs.readFile(__dirname +'\\' + files[0], (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            vttToJson(data.toString())
                                .then((result) => {
                                    //console.log(result);
                                    amqp.connect('amqp://localhost', (err, conn) => {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            conn.createChannel((err, ch) => {
                                                if (err) {
                                                    console.error(err);
                                                } else {
                                                    const q = 'v_queue';
                                                    ch.assertQueue(q, {
                                                        durable: false
                                                    });
                                                    msg = JSON.stringify(msg);
                                                    ch.sendToQueue(q, new Buffer(msg), {
                                                        persistent: true
                                                    });
                                                    console.log(" [x] Sent '%s'", msg);
                                                    let m = 0;
                                                    let s = 0;
                                                    for (let i = 100; i < 250/*result.length*/; i++) {
                                                        if ((result[i].part.toLowerCase().indexOf('angular') != -1) || (result[i].part.toLowerCase().indexOf('ember') != -1)) {
                                                            let st = Math.floor(parseInt(result[i].start) / 1000);
                                                            m = Math.floor(st / 60);
                                                            s = Math.floor(st % 60);
                                                            let parturl = url + '&t=' + m.toString() + 'm' + s.toString() + 's';
                                                            msg = {
                                                                part: result[i].part,
                                                                url: parturl
                                                            };
                                                            msg = JSON.stringify(msg);
                                                            ch.sendToQueue(q, new Buffer(msg), {
                                                                persistent: true
                                                            });
                                                            console.log(" [x] Sent '%s'", msg);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    });
                                })
                                .catch((er) => {
                                    console.log(er);
                                });
                        }
                    });

                });
            });
        }
    })
    .catch((er) => {
        console.log(er);
    });
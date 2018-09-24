const Connecting = require('./dbConnect');
const connecting = new Connecting();
const amqp = require('amqplib/callback_api');

connecting.connect();
connecting
    .fetch()
    .then((results) => {
        console.log(results);
        amqp.connect('amqp://localhost', (err, conn) => {
            if (err) {
                console.error(err);
            } else {
                conn.createChannel((err, ch) => {
                    if (err) {
                        console.error(err);
                    } else {
                        const q = 'task_queue';
                        let msg = '';

                        ch.assertQueue(q, {
                            durable: false
                        });
                        for (let i = 0; i < results.length; i++) {
                            msg = JSON.stringify(results[i]);
                            ch.sendToQueue(q, new Buffer(msg), {
                                persistent: true
                            });
                            console.log(" [x] Sent '%s'", msg);
                        }
                    }
                });
            }
        });
    })
    .catch((er) => {
        console.log(er);
    });
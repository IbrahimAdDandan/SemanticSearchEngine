const Indexer = require('./indexer/indexer');
const amqp = require('amqplib/callback_api');

const dataset = 's3e';
const ontoPrefix = 'PREFIX ns: <http://www.semanticweb.org/myonto#>';
const indexer = new Indexer(ontoPrefix, dataset);

amqp.connect('amqp://localhost', (err, conn) => {
    if (err) {
        console.error(err);
    } else {
        conn.createChannel((err, ch) => {
            if (err) {
                console.error(err);
            } else {
                var q = 'v_queue';

                ch.assertQueue(q, {
                    durable: false
                });
                ch.prefetch(1);
                console.log(" [*] video indexer Waiting for messages in %s. To exit press CTRL+C", q);
                ch.consume(q, (msg) => {
                    let recieved = JSON.parse(msg.content.toString());
                    console.log(" [x] video indexer Received a message");
                    indexer
                        .indexingv(recieved)
                        .then((m) => {
                            //console.log(m);
                            ch.ack(msg);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }, {
                    noAck: false
                });
            }
        });
    }
});
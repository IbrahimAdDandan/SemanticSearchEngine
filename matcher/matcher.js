const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ProcessReq = require('./processReq/processReq');
const childProcess = require('child_process');
const napa = require('napajs');
const zone1 = napa.zone.create('zone1', {
    workers: 4
});

const app = express();
const port = 3333;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
const processReq = new ProcessReq();
//app.post('/api/search', processReq.searchSemantic);

app.post('/api/search', (req, res) => {
    zone1.execute(processReq.searchSemantic(req, res), [])
        .then(result => {
            console.log(result.value);
        })
        .catch(err => console.log(err));
});

app.post('/api/lexsearch', processReq.searchSemanticLexical);

childProcess.spawn('node', ['../indexer/index'], {
    stdio: 'inherit'
});

childProcess.spawn('node', ['../node_modules/openwebspider/src/server'], {
    stdio: 'inherit'
});

app.listen(port, () => {
    console.log(`Matcher server is started on port: ${ port }`);
});

module.exports = app;
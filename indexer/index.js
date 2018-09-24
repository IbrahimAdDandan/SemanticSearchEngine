const express = require('express');
const childProcess = require('child_process');

const app = express();
const port = 8888;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res
        .status(200)
        .render('index', {
            disabled: 'disabled',
            inited: false,
            started: false
        });
});
app.post('/initdata', (req, res) => {
    let newProcess = childProcess.spawn('node', ['../initData/index'], {
        stdio: 'inherit'
    });
    let newerProcess = childProcess.spawn('node', ['../initData/indexv'], {
        stdio: 'inherit'
    });
    res
        .status(200)
        .render('index', {
            disabled: '',
            inited: true,
            started: false
        });
});
app.post('/indexing', (req, res) => {
    let firstWorker = childProcess.spawn('node', [__dirname+'/indexer.first'], {
        stdio: 'inherit'
    });
    let indexervWorker = childProcess.spawn('node', [__dirname+'/indexerv.first'], {
        stdio: 'inherit'
    });
    let secondWorker = childProcess.spawn('node', [__dirname+'/indexer.second'], {
        stdio: 'inherit'
    });
    res
        .status(200)
        .render('index', {
            disabled: '',
            inited: true,
            started: true
        });
});
app.listen(port, () => {
    console.log(`Indexer is started on port ${port}`);
});
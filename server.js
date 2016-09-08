var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use('/admin/public', express.static(require('path').join(__dirname, 'public')));

function listOfTestSuites(name, client) {
    client([
        {id:"test1", metaData: {}},
        {id:"test2", metaData: {}},
        {id:"test3", metaData: {}}
    ]);
}

io.on('connection', function (socket) {
    socket.on('list_of_test_suites', listOfTestSuites);
    socket.emit('automation_report', {
        log:[
            {
                "title":"Adult popup",
                "index":0,
                "steps":[
                    {"title":"Navigate to Register", "result":["0.019 sec","ok"]},
                    {"title":"Open adult popup","result":["0.971 sec","ok"]},
                    {"title":"Check that the popup is opened","result":["0.982 sec","ok"]},
                    {"title":"Check close button","result":["1.001 sec","ok"]},
                    {"title":"Check \"OK\" button","result":["3.004 sec","err", "error!!"]}
                ]
            }
        ],
        "device":"Chrome 52.0.2743.116 32-bit on Windows 8.1 64-bit"
    });
});

server.listen(9876);
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
});

server.listen(9876);
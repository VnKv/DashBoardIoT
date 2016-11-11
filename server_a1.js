var port = process.argv[2];

var express = require('express');  
var app = express();  
var bodyParser = require('body-parser');
var server = require('http').Server(app);  

app.use(bodyParser.json());

app.post('/', function (request, response) {
    console.log(request.body);
});

server.listen(port, function() {  
    console.log('Servidor corriendo en http://localhost:' + port);
});


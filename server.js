//Lista de frecuencias de envio en espera a ser enviadas
var arduinos = [];

//Paquetes
var express = require('express');  
var app = express();  
var bodyParser = require('body-parser');
var server = require('http').Server(app);  
var io = require('socket.io')(server); 

app.use(express.static('public'));
app.use(bodyParser.json());

io.on('connection', function(socket) {  
    //Escucha el evento webServer que envia los datos de la actualizaciones de
    //la frecuencia de envio de algun Arduino
    socket.on('webServer',function(data){
    	console.log(data);
        var index = findArduino(data.id);
        //Si existe una actualizacion reemplaza con el nuevo valor recibido
        if(index >= 0){
            arduinos[index].delay = data.delay;
        }else{
            //Si no existe agrega un nuevo objeto a la lista de actualizaciones 
            arduinos.push(data);    
        }
        printArduinos();
    });
    socket.on('attacker',function(data){
        console.log(data);
    });
});

app.post('/', function (request, response) {
    console.log(request.body);
    var delay;
    var index = findArduino(request.body.id);
    if(index >= 0){
        delay = arduinos[index];
        arduinos.splice(index,1);   
        printArduinos();    
    }
    
    //Envia los datos que recibe de los dispositivos al Frontend
    //para ser graficados
    io.sockets.emit('client',request.body);
    response.send(delay);
});

server.listen(3000, function() {  
    console.log('Servidor corriendo en http://localhost:3000');
});

//Retorna la actualizacion para determinado arduino por id, si existe
function findArduino(id_a){
    for (var i = arduinos.length - 1; i >= 0; i--) {
        if(arduinos[i].id == id_a){
            return i;
        }
    }
    return -1;
}
//Muestra la lista de actualizaciones en espera
function printArduinos(){
    console.log("Arduinos: " + arduinos.length);
    for (var i = arduinos.length - 1; i >= 0; i--) {
        console.log(arduinos[i].id + ": " + arduinos[i].delay);
    }
}
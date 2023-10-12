const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Redis = require('ioredis');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173', 
      methods: ['GET', 'POST'],
    },
});
const redis = new Redis();


app.use(cors({
    origin: 'http://localhost:5173' 
}));

app.get('/', (req, res) => {
    res.send('Servidor Node.js en funcionamiento');
});

// Esta función se encargará de enviar los datos a todos los clientes conectados
const sendAlbumsToClients = async () => {
    console.log('Enviando álbumes a clientes desde Redis');
    try {
    const albumKeys = await redis.keys('*');
    const allAlbums = [];
    for (const albumKey of albumKeys) {
        const albumData = await redis.hgetall(albumKey);
        allAlbums.push(albumData);
    }
    io.emit('albums', allAlbums);
    } catch (error) {
    console.error('Error al obtener datos de álbumes desde Redis:', error.message);
    }
};
  


io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Envía los datos al cliente cuando se conecta
    sendAlbumsToClients();

    socket.on('getAlbums', () => {
        // Envía los datos al cliente cuando lo solicita
        sendAlbumsToClients();
    });
});

setInterval(sendAlbumsToClients, 500); 

server.listen(3001, () => {
  console.log('Servidor Node.js en ejecución en el puerto 3001');
});

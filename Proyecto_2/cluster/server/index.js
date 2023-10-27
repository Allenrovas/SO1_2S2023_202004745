const Redis = require('ioredis');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    db: 0
});

const dbPool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'secret',
    database: process.env.MYSQL_DATABASE || 'so1_pr2',
    port: process.env.MYSQL_PORT || 3306,
    connectionLimit: 10
});

const port = process.env.PORT || 3000;

const sendNotasOfRedis = async () => {
    console.log('Enviando notas a clientes desde Redis');
    try {
        const allNotasData = await redisClient.hgetall("notas");

        const allNotas = Object.values(allNotasData).map(notaData => JSON.parse(notaData));

        console.log('Notas recuperadas desde Redis:', allNotas.length);
        io.emit('notasRedis', allNotas);
    } catch (error) {
        console.error('Error al obtener datos de notas desde Redis:', error.message);
    }
}

const sendNotasOfMysql = () => {
    console.log('Enviando notas a clientes desde MySQL');
    
    dbPool.getConnection((err, connection) => {
      if (err) {
        console.error('Error al obtener conexión del pool:', err);
        return;
      }
  
      connection.query('SELECT * FROM nota', (error, results) => {
        connection.release(); // Liberar la conexión de vuelta al pool
  
        if (error) {
          console.error('Error al consultar MySQL:', error);
        } else {
          io.emit('notasMysql', results);
        console.log('Enviando notas a clientes desde MySQL con length: ', results.length);
        }
      });
    });
  }
  



io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Envía los datos al cliente cuando se conecta
    sendNotasOfRedis();
    sendNotasOfMysql();

    socket.on('getNotasRedis', () => {
        // Envía los datos al cliente cuando lo solicita
        sendNotasOfRedis();
    });
    socket.on('getNotasMysql', () => {
        // Envía los datos al cliente cuando lo solicita
        sendNotasOfMysql();
    });
});

setInterval(sendNotasOfRedis, 500); 
setInterval(sendNotasOfMysql, 2000);



server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

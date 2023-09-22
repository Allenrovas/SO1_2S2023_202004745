const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8000;

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'pr1_so1',
  port: 3306
});

connection.connect((error) => {
  if (error) {
    console.error('Error de conexión: ' + error.stack);
    return;
  }
  console.log('Conectado a la base de datos MySQL.');
});

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.use(bodyParser.json());
app.use(cors());


var listaPc = [];
var listaCpu = [];
var listaRam = [];

// Listas de históricos
var historicoPc = [];
var historicoCpu = [];
var historicoRam = [];

app.post('/cpu' , (req, res) => {
  cpuData = req.body;
  // Obtener ip del cliente
  const ipAddress = req.header('x-forwarded-for')  || req.socket.remoteAddress;
  console.log(`IP: ${ipAddress} - CPU: ${cpuData}`);
  console.log(`Porcentaje de uso de CPU: ${cpuData.Porcentaje_en_uso}`);
  //Verificar si la ip ya existe en la lista y guardarla si no existe, además guardar la posición en la que se encuentra
  var existe = false;
  var posicion = 0;
  for (var i = 0; i < listaPc.length; i++) {
    if (listaPc[i].ip == ipAddress) {
      existe = true;
      posicion = i;
    }
  }
  //Si la ip ya existe en la lista, se actualiza el porcentaje de uso de CPU y RAM
  if (existe) {
    listaCpu[posicion] = cpuData;
  } else {
    //Si la ip no existe en la lista, se agrega a la lista
    listaPc.push({ip: ipAddress});
    listaCpu.push(cpuData);
  }

  //Verificar si la ip ya existe en el histórico y guardarla si no existe, además guardar la posición en la que se encuentra
  var existe = false;
  var posicion = 0;
  for (var i = 0; i < historicoPc.length; i++) {
    if (historicoPc[i].ip == ipAddress) {
      existe = true;
      posicion = i;
    }
  }
  //Si la ip ya existe en el histórico, se actualiza el porcentaje de uso de CPU y RAM
  if (existe) {
    historicoCpu[posicion] = cpuData;
  } else {
    //Si la ip no existe en el histórico, se agrega a la lista
    historicoPc.push({ip: ipAddress});
    historicoCpu.push(cpuData);
  }

  //Guardar el porcentaje de uso de CPU en la base de datos

  res.send('Datos recibidos CPU');

}); 

app.post('/ram', (req, res) => {
  ramData = req.body;
  // Obtener ip del cliente
  const ipAddress = req.header('x-forwarded-for')  || req.socket.remoteAddress;
  console.log(`IP: ${ipAddress} - RAM: ${ramData}`);
  console.log(`Porcentaje de uso de RAM: ${ramData.Porcentaje_en_uso}`);
  //Verificar si la ip ya existe en la lista y guardarla si no existe, además guardar la posición en la que se encuentra
  var existe = false;
  var posicion = 0;
  for (var i = 0; i < listaPc.length; i++) {
    if (listaPc[i].ip == ipAddress) {
      existe = true;
      posicion = i;
    }
  }
  //Si la ip ya existe en la lista, se actualiza el porcentaje de uso de CPU y RAM
  if (existe) {
    listaRam[posicion] = ramData;
  } else {
    //Si la ip no existe en la lista, se agrega a la lista
    listaPc.push({ip: ipAddress});
    listaRam.push(ramData);
  }

  //Verificar si la ip ya existe en el histórico y guardarla si no existe, además guardar la posición en la que se encuentra
  var existe = false;
  var posicion = 0;
  for (var i = 0; i < historicoPc.length; i++) {
    if (historicoPc[i].ip == ipAddress) {
      existe = true;
      posicion = i;
    }
  }
  //Si la ip ya existe en el histórico, se actualiza el porcentaje de uso de CPU y RAM
  if (existe) {
    historicoRam[posicion] = ramData;
  } else {
    //Si la ip no existe en el histórico, se agrega a la lista
    historicoPc.push({ip: ipAddress});
    historicoRam.push(ramData);
  }

  //Guardar el porcentaje de uso de RAM en la base de datos

  res.send('Datos recibidos RAM');
});

app.get('/monitoreo', (req, res) => {
  console.log('Petición GET recibida');
  //Meter los datos de CPU y RAM en un arreglo
  var listaMonitoreo = [];
  if (listaPc.length > 0) {
    for (var i = 0; i < listaPc.length; i++) {
      listaMonitoreo.push({
        ip: listaPc[i].ip,
        cpu: listaCpu[i],
        ram: listaRam[i]
      });
    } 
  }else{
    for (var i = 0; i < historicoPc.length; i++) {
      listaMonitoreo.push({
        ip: historicoPc[i].ip,
        cpu: historicoCpu[i],
        ram: historicoRam[i]
      });
    }
  }
  //Mandar en formato json
  res.json({monitoreo: listaMonitoreo});
});

// Intervalo para vaciar las listas cada 10 segundos
setInterval(() => {
  
    

  // Vaciar las listas principales
  listaPc = [];
  listaCpu = [];
  listaRam = [];
}, 10000);

// Intervalo para vaciar los históricos cada 15 segundos

setInterval(() => {
  historicoPc = [];
  historicoCpu = [];
  historicoRam = [];
}, 5555);




app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8000;
const axios = require('axios');
const { createPool } = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();


const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

//Crear tablas en la base de datos si no existen

const createTable = async () => {
  const query = await pool.query('CREATE TABLE IF NOT EXISTS ram_historico (id_ram INT AUTO_INCREMENT PRIMARY KEY,uso INT NOT NULL,ip VARCHAR(50) NOT NULL,fecha DATETIME NOT NULL);');
  console.log(query);
  const query2 = await pool.query('CREATE TABLE IF NOT EXISTS cpu_historico (id_cpu INT AUTO_INCREMENT PRIMARY KEY,uso INT NOT NULL,ip VARCHAR(50) NOT NULL,fecha DATETIME NOT NULL);');
  console.log(query2);
}

createTable();

  


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

app.post('/cpu' , async(req, res) => {
  cpuData = req.body;
  // Obtener ip del cliente
  let ipAddress = req.header('x-forwarded-for')  || req.socket.remoteAddress;
  if (ipAddress.substr(0, 7) == "::ffff:") {
    ipAddress = ipAddress.substr(7)
  }
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
  await pool.query('INSERT INTO cpu_historico (uso, ip, fecha) VALUES (?, ?, NOW())', [cpuData.Porcentaje_en_uso, ipAddress]);
  

  res.send('Datos recibidos CPU');

}); 

app.post('/ram', async(req, res) => {
  ramData = req.body;
  // Obtener ip del cliente
  let ipAddress = req.header('x-forwarded-for')  || req.socket.remoteAddress;
  if (ipAddress.substr(0, 7) == "::ffff:") {
    ipAddress = ipAddress.substr(7)
  }
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
  await pool.query('INSERT INTO ram_historico (uso, ip, fecha) VALUES (?, ?, NOW())', [ramData.Porcentaje_en_uso, ipAddress]);

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

app.get('/ips', (req, res) => {
  console.log('Petición GET recibida');
  //Meter los datos de CPU y RAM en un arreglo
  var listaIps = [];
  if (listaPc.length > 0) {
    for (var i = 0; i < listaPc.length; i++) {
      listaIps.push(listaPc[i].ip);
    } 
  }else{
    for (var i = 0; i < historicoPc.length; i++) {
      listaIps.push(historicoPc[i].ip);
    }
  }
  //Mandar en formato json
  res.json({ips: listaIps});


});


app.post('/kill', (req, res) => {
  serviceKill = req.body;
  console.log(`IP: ${serviceKill.ip} - Servicio: ${serviceKill.pid}`);
  // Hacer el kill del proceso en la IP indicada
  // Pasar a IPv4
  //172.20.0.2:5200/kill/${serviceKill.pid}`)
  axios.post(`http://${serviceKill.ip}:5200/kill/${serviceKill.pid}`)
    .then((respuesta) => {
      // Sacar el atributo respuesta del JSON
      const response = respuesta.data.respuesta;

      // Enviar la respuesta JSON al cliente dentro de la promesa
      res.json({ mensaje: response });
    })
    .catch((error) => {
      // Manejo de errores si la solicitud Axios falla
      console.error(error);
      res.status(500).json({ mensaje: 'Error en la solicitud HTTP' });
    });
});

app.get('/historico/:ip', async(req, res) => {
  const ipAddress = req.params.ip;
  console.log(`IP: ${ipAddress}`);
  // Obtener el historico de uso de CPU y RAM de la ip indicada
  const query = await pool.query('SELECT uso, fecha FROM cpu_historico WHERE ip = ? ', [ipAddress]);
  const query2 = await pool.query('SELECT uso, fecha FROM ram_historico WHERE ip = ?', [ipAddress]);
  //Mandar en formato json
  res.json({cpu: query[0], ram: query2[0]});
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
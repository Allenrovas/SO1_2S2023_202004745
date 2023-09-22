import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../Components/NavBar'
import "../Styles/Styles.css"
import Service from '../Services/Service'
import Chart from 'chart.js/auto'; // Importa Chart.js
import Input from '../Components/Input';


function Index() {
  const [ips, setIps] = React.useState([]);
  const [monitoreo, setMonitoreo] = React.useState([]);
  const [selectedIp, setSelectedIp] = useState("");
  const cpuChart = useRef(null);
  const ramChart = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [buscar, setBuscar] = useState("");


  useEffect(() => {
    // Obtener lista de IPs

    const getIps = async () => {
      try {
        const response = await Service.ips();
        const ipArray = response.monitoreo.map((item) => item.ip);
        // Verificar si la dirección IP seleccionada está en la lista actual
        const isIpSelectedValid = ipArray.includes(selectedIp);
        console.log(response)
        setIps(ipArray)
  
        // Si la dirección IP seleccionada está en la lista, seleccionarla nuevamente
        if (isIpSelectedValid) {
          console.log("Actualizando gráficas");
          setSelectedIp(selectedIp);
          updateCharts(selectedIp,response);
        }

      } catch (error) {
        console.error("Error al obtener las direcciones IP:", error);
      }
    };

    if (!initialized) {
      const cpuChartElement = document.getElementById('cpuChart');
      const ramChartElement = document.getElementById('ramChart');
      if (cpuChartElement && ramChartElement) {
        plotCharts();
        setInitialized(true);
      }
    }
  
    // Obtener lista de IPs al cargar y luego cada 5 segundos
    getIps();
    const intervalIp = setInterval(getIps, 1000);
    //Gráficas
  
    // Limpiar intervalos
    return () => {
      clearInterval(intervalIp);
    };
  }, [selectedIp]);

  const handleIpChange = (event) => {
    setSelectedIp(event.target.value);
  };

  const updateCharts = (selectedIp, response) => {
    const selectedIpData = response.monitoreo.find((item) => item.ip === selectedIp);

    if (selectedIpData) {
      // Actualiza datos para las gráficas de CPU y RAM
      cpuChart.current.data.datasets[0].data = [
        selectedIpData.cpu.Porcentaje_en_uso,
        100 - selectedIpData.cpu.Porcentaje_en_uso,
      ];
      ramChart.current.data.datasets[0].data = [
        selectedIpData.ram.Porcentaje_en_uso,
        100 - selectedIpData.ram.Porcentaje_en_uso,
      ];

      // Actualiza los gráficos
      cpuChart.current.update();
      ramChart.current.update();
    }
  };

  const plotCharts = () => {
    // Destruye los gráficos existentes
    if (cpuChart.current) {
      cpuChart.current.destroy();
    }
    if (ramChart.current) {
      ramChart.current.destroy();
    }

    // Crea los gráficos de CPU y RAM
    cpuChart.current = new Chart(document.getElementById('cpuChart'), {
      type: 'pie',
      data: {
        labels: ['% de uso de CPU', '% libre de CPU'],
        datasets: [
          {
            data: [0, 100],
            backgroundColor: ['#E53935', '#3498DB'],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Porcentaje de Uso de CPU',
            fontSize: 30, // Tamaño del título
            color: 'white', // Color del título
          },
          legend: {
            labels: {
              color: 'white', // Cambia el color del texto de los labels a blanco
            },
          },
        },
        legend: {
          display: true,
          color: 'white', // Color de los labels del pie
        },
      },
    });

    ramChart.current = new Chart(document.getElementById('ramChart'), {
      type: 'pie',
      data: {
        labels: ['% de uso de RAM', '% libre de RAM'],
        datasets: [
          {
            data: [0, 100],
            backgroundColor: ['#E53935', '#3498DB'],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Porcentaje de Uso de RAM',
            fontSize: 30, // Tamaño del título
            color: 'white', // Color del título
          },
          legend: {
            labels: {
              color: 'white', // Cambia el color del texto de los labels a blanco
            },
          },
        },
        legend: {
          display: true,
          color: 'white', // Color de los labels del pie
        },
      },
    });
  };

  const buscarClick = () => {
    //Verificar que sea int
    if (isNaN(buscar)) {
      alert("Ingrese un número entero");
      return;
    }
  }

  const changeBuscar = (value) => {
    setBuscar(value);
  }

 


  return (
    <>
    <NavBar/>
    <h1>Monitoreo a Tiempo Real</h1>
    <div>
      <select value={selectedIp} onChange={handleIpChange} className="custom-select centered">
        <option value="">Selecciona una dirección IP</option>
        {ips.length > 0 && ips.map((ip, index) => (
          <option key={index} value={ip}>
            {ip}
          </option>
        ))}
      </select>
      { ips.length > 0 && selectedIp && (
        <div>
          <h3>Dirección IP seleccionada: {selectedIp}</h3>
        </div>
      )}
      {(
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ flex: 1, margin: '5px', maxWidth: '600px' }}>
            <canvas id="cpuChart" width="100" height="100"></canvas>
          </div>
          <div style={{ flex: 1, margin: '5px', maxWidth: '600px' }}>
            <canvas id="ramChart" width="100" height="100"></canvas>
          </div>
        </div>
        )}
    </div>
    <div class ="container" >
          <h1>PID</h1>
          <Input text={"Buscar"} type={"text"} handlerChange = {changeBuscar} id={"floatingBuscar"}/>
          <button type="button" class="btn btn-primary" onClick={buscarClick}>Ingresar</button>
    </div>
    

    
    </>
  );
}

export default Index;
import React, { useState,useEffect } from "react";
import NavBar from '../Components/NavBar'
import Service from "../Services/Service";
import Lineal from "../Components/GraficaLinea";





function Historial() {
  const [ips, setIps] = React.useState([]);
  const [selectedIp, setSelectedIp] = useState("");
  const [dataRam, setDataRam] = useState([]);
  const [dataCpu, setDataCpu] = useState([]);


  useEffect(() => {

    const getIps = async () => {
      try{
        const response = await Service.ips();
        setIps(response.ips);

        // Verificar si la dirección IP seleccionada está en la lista actual
        const isIpSelectedValid = response.ips.includes(selectedIp);
        // Si la dirección IP seleccionada está en la lista, seleccionarla nuevamente
        if (isIpSelectedValid){
          console.log("Actualizando gráficas");
          setSelectedIp(selectedIp);
          //Setear procesos de la ip seleccionada
          console.log(selectedIp);
          const response2 = await Service.historico(selectedIp);
          setDataCpu(response2.cpu);
          setDataRam(response2.ram);
          console.log(response2);
        }
    
      }
        catch (error){
          console.error("Error al obtener las direcciones IP:", error);
        }
    }

    // Obtener lista de IPs al cargar y luego cada 5 segundos
    getIps();
    const intervalIp = setInterval(getIps, 5000);
    //Gráficas
  
    // Limpiar intervalos
    return () => {
      clearInterval(intervalIp);
    };

  }, [selectedIp]);

  const handleIpChange = (event) => {
    setSelectedIp(event.target.value);
  };

  return (
    <>
    <NavBar/>
    <h1>Monitoreo a lo largo del tiempo</h1>
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
      { ips.length > 0 && selectedIp && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ flex: 1, margin: '5px', maxWidth: '1200px' }}>
            <h2>Historial de uso de CPU</h2>
            <Lineal data={dataCpu} />
          </div>
          <div style={{ flex: 1, margin: '5px', maxWidth: '1200px' }}>
            <h2>Historial de uso de RAM</h2>
            <Lineal data={dataRam} />
          </div>
        </div>
      )
      }
    </div>
    
    </>
  );
}

export default Historial;
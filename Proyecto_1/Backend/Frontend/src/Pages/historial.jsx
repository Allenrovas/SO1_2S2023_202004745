import React, { useState,useEffect } from "react";
import NavBar from '../Components/NavBar'




function Historial() {
  const [ips, setIps] = React.useState([]);
  const [selectedIp, setSelectedIp] = useState("");
/*
  useEffect(() => {

    const getIps = async () => {
      try{
        const response = await Service.ips();
        
        }
      }

    }
  }, [selectedIp]);*/

  return (
    <>
    <NavBar/>
    <h1>Monitoreo a lo largo del tiempo</h1>
    
    </>
  );
}

export default Historial;
import React from "react";
import Typography from "@mui/material/Typography";


function TablaProcesos({ procesosPc, totalMbRam }) {
    const [desplegados, setDesplegados] = React.useState({});

    const handleDesplegados = (pid) => {
        setDesplegados({...desplegados, [pid]: !desplegados[pid]});
    }

    const crearFilas = (procesos) => {
        console.log(totalMbRam);
        return procesos.map((proceso) => (
            <React.Fragment key={proceso.pid}>
                <tr className= {desplegados[proceso.pid] && "desplegado"}>
                    <td style={{color:'white', backgroundColor: `${proceso.pid === 0 || !procesosPc.some((p) => p.pid === proceso.padre) ? "#212529": "" }`}} >{proceso.pid}</td>
                    <td style={{color:'white'}}>{proceso.nombre}</td>
                    <td style={{color:'white'}}>{proceso.usuario}</td>
                    <td style={{color:'white'}}>{proceso.estado}</td>
                    <td style={{color:'white'}}>{(proceso.ram/(totalMbRam*100))}</td>
                    <td style={{color:'white'}}>{proceso.padre}</td>
                    <td style={{color:'white'}}>{
                        procesosPc.filter((p) => p.padre === proceso.pid).length > 0 && (
                            <button class="btn btn-dark" onClick={() => handleDesplegados(proceso.pid)}>
                                {desplegados[proceso.pid] ? "Ocultar" : "Mostrar"}
                            </button>      
                        )
                    }</td>
                </tr>
                {desplegados[proceso.pid] && crearFilas(procesosPc.filter((p) => p.padre === proceso.pid))}
            </React.Fragment>
        ));
    };
    return (
        <div style={{ width: '90%', margin: '0 auto', padding: '0 5%' }}>
            <h1>Procesos</h1>
            <table className="table">
                <thead>
                    <tr>
                    <th style={{width: 200, backgroundColor:"#212529"}} ><Typography variant="h5" color="white" component="div"><b>PID</b></Typography></th>
                    <th style={{width: 200, backgroundColor:"#212529"}} ><Typography variant="h5" color="white" component="div"><b>Nombre</b></Typography></th>
                    <th style={{width: 200, backgroundColor:"#212529"}} ><Typography variant="h5" color="white" component="div"><b>Usuario</b></Typography></th>
                    <th style={{width: 200, backgroundColor:"#212529"}} ><Typography variant="h5" color="white" component="div"><b>Estado</b></Typography></th>
                    <th style={{width: 200, backgroundColor:"#212529"}} ><Typography variant="h5" color="white" component="div"><b>% Ram</b></Typography></th>
                    <th style={{width: 200, backgroundColor:"#212529"}} ><Typography variant="h5" color="white" component="div"><b>Padre</b></Typography></th>
                    <th style={{width: 200, backgroundColor:"#212529"}} ><Typography variant="h5" color="white" component="div"><b>Mostrar/Ocultar</b></Typography></th>
                    </tr>
                </thead>
                <tbody>
                    {crearFilas(procesosPc.filter((p) => p.padre === 0 || !procesosPc.some((p2) => p2.pid === p.padre)))}
                </tbody>
            </table>
        </div>
    )
}

export default TablaProcesos;
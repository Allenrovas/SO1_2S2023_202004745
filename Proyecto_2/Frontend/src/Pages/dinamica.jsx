import React, { useState,useEffect } from "react";
import NavBar from '../Components/NavBar'
import Horizontal from "../Components/HorizontalBar";
import io from "socket.io-client";

const socket = io("http://localhost:3001");



function Historial() {
  const semestre = [
    { value: '1S', label: 'Primer Semestre' },
    { value: '2S', label: 'Segundo Semestre' },
  ];
  const cursos = [
    {value: 'SO1', label: 'Sistemas Operativos 1'},
    {value: 'BD1', label: 'Bases de Datos 1'},
    {value: 'LFP', label: 'Lenguajes Formales y de Programación'},
    {value: 'SA', label: 'Software Avanzado'},
    {value: 'AYD1', label: 'Análisis y Diseño 1'},
  ];
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [labelCantidadDatos, setLabelCantidadDatos] = useState('Cantidad de datos: 0');
  const [notasRedis, setnotasRedis] = useState([]);
  const [cursosData, setCursosData] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  


  useEffect(() => {
    const handleGetNotasRedis = (data) => {
      setnotasRedis(data);
      setLabelCantidadDatos('Cantidad de datos: ' + data.length);
    }
    socket.emit('getNotas');
    console.log("Evento getNotas emitido");
    socket.on('notasRedis', handleGetNotasRedis);

    return () => socket.off('notasRedis', handleGetNotasRedis);
  }, []);


  const handleSemestreChange = (e) => {
    setSelectedSemestre(e.target.value);
  }


  useEffect(() => {
    //Cursos vs Cantidad de estudiantes
    if (selectedSemestre) {
      const NotasFiltradas = notasRedis.filter(nota => nota.Semestre === selectedSemestre);

      const cursosData = {};
      NotasFiltradas.forEach(nota => {
        if (!cursosData[nota.Curso]) {
          cursosData[nota.Curso] = {cantidad: 0};
        }
        cursosData[nota.Curso].cantidad++;
      });

      const NumeroCursos = Object.keys(cursosData).map(curso => ({curso, cantidad: cursosData[curso].cantidad}));

      const cursosAct = NumeroCursos.map(curso => curso.curso);
      const cantidadAct = NumeroCursos.map(curso => curso.cantidad);
      //Ponerle el nombre a los cursos
      cursosAct.forEach((curso, index) => {
        cursos.forEach(cursoObj => {
          if (cursoObj.value === curso) {
            cursosAct[index] = cursoObj.label;
          }
        });
      });


      setCursosData(cursosAct);
      setCantidad(cantidadAct);
    }
  }, [selectedSemestre]);

  
  return (
    <>
    <NavBar/>
    <h1>Notas Dinámicas en Redis</h1>
    <h2 style={{margin: '40px'}}>{labelCantidadDatos}</h2>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '40px' }}>
    <div style={{ display: 'flex',justifyContent: 'center' , flexDirection: 'column', alignItems: 'center', margin: '40px 60px',maxWidth: '500px' }}>
      <h3 style={{ marginTop: '0' }}>Cursos vs Cantidad de estudiantes</h3>
      <div style={{ display: 'flex' }}>
        <select value={selectedSemestre} onChange={handleSemestreChange} className="custom-select centered" style={{ width: '250px', marginRight: '10px' }}>
          <option value="">Selecciona un Semestre</option>
          {semestre.length > 0 && semestre.map((se, index) => (
            <option key={index} value={se.value}>
              {se.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ flex: 1, margin: '5px' }}>
        <Horizontal carnets={cursosData} promedios={cantidad} width="400" height="400" />
      </div>
    </div>
    </div>


    </>
  );
}

export default Historial;
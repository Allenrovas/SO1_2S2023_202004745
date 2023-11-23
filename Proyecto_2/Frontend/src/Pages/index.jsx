import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../Components/NavBar'
import "../Styles/Styles.css"
import io from "socket.io-client";
import Chart from 'chart.js/auto'; // Importa Chart.js
import Lineal from '../Components/GraficaLinea';

const socket = io(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`);

function Index() {
  const aprobadosChart = useRef(null);
  const [initialized, setInitialized] = useState(false);
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
  const [selectedCursoAprobado, setSelectedCursoAprobado] = useState('');
  const [selectedSemestreAprobado, setSelectedSemestreAprobado] = useState('');
  const [selectedSemestrePromedio, setSelectedSemestrePromedio] = useState('');
  const [selectedNumeroAlumnos, setselectedNumeroAlumnos] = useState('');
  const [notas, setNotas] = useState([]);
  const [notasFiltradasAprobados, setNotasFiltradasAprobados] = useState([]);
  const [topCarnetsPromedio, setTopCarnetsPromedio] = useState([]);
  const [topPromedios, setTopPromedios] = useState([]);
  const [cursosTop, setCursosTop] = useState([]);
  const [cantidadTop, setCantidadTop] = useState([]);

  useEffect(() => {

    
    const handleGetNotas = (data) => {
      setNotas(data);
    }
    socket.emit("getNotas");
    console.log('Evento "notasMysql" emitido');
    


    

    socket.on("notasMysql", handleGetNotas);
    // Limpia la suscripción al desmontar el componente

    if (!initialized) {
      const aprobadosChartElement = document.getElementById('aprobadosChart');
      if (aprobadosChartElement) {
        plotCharts();
        setInitialized(true);
      }
    }

    return () => {
      socket.off("notasMysql", handleGetNotas);
    };

    

  }, []);


  useEffect(() => {
    if (selectedCursoAprobado && selectedSemestreAprobado) {
      const notasFiltradas = notas.filter((nota) => nota.curso === selectedCursoAprobado && nota.semestre === selectedSemestreAprobado);
      setNotasFiltradasAprobados(notasFiltradas);
    } else {
      setNotasFiltradasAprobados([notas]);
    }
  }, [selectedCursoAprobado, selectedSemestreAprobado]);

  useEffect(() => {
    updateCharts(selectedCursoAprobado, selectedSemestreAprobado, notasFiltradasAprobados);
  }, [notasFiltradasAprobados]);

  useEffect(() => {
    if (selectedSemestrePromedio) {
      const notasFiltradas = notas.filter((nota) => nota.semestre === selectedSemestrePromedio);

      for (let i = 0; i < notasFiltradas.length; i++) {
        const nota = notasFiltradas[i];
        //Eliminar la nota si es menor a 61
        if (nota.nota < 61) {
          notasFiltradas.splice(i, 1);
          i--;
        }
      }
      
      const carnetData = {};
      notasFiltradas.forEach((nota) => {
        if (!carnetData[nota.carnet]) {
          carnetData[nota.carnet] = {total: 0, cantidad: 0};
        }
        carnetData[nota.carnet].total += nota.nota;
        carnetData[nota.carnet].cantidad += 1;
      });

      const top5Alumnos = Object.keys(carnetData).map((carnet) => ({
        carnet,
        promedio: carnetData[carnet].total / carnetData[carnet].cantidad,
      }));

      top5Alumnos.sort((a, b) => b.promedio - a.promedio);

      const top5AlumnosFiltrados = top5Alumnos.slice(0, 5);

      const carnets = top5AlumnosFiltrados.map((alumno) => alumno.carnet);
      const promedios = top5AlumnosFiltrados.map((alumno) => alumno.promedio);

      setTopCarnetsPromedio(carnets);
      setTopPromedios(promedios);
    }
  }, [selectedSemestrePromedio]);

  useEffect(() => {
    //Top 3 cursos con mayor cantidad de alumnos 
    if (selectedNumeroAlumnos) {
      const notasFiltradas = notas.filter((nota) => nota.semestre === selectedNumeroAlumnos);

      const cursosData = {};
      notasFiltradas.forEach((nota) => {
        if (!cursosData[nota.curso]) {
          cursosData[nota.curso] = {cantidad: 0};
        }
        cursosData[nota.curso].cantidad += 1;
      });

      const top3Cursos = Object.keys(cursosData).map((curso) => ({
        curso,
        cantidad: cursosData[curso].cantidad,
      }));

      top3Cursos.sort((a, b) => b.cantidad - a.cantidad);

      const top3CursosFiltrados = top3Cursos.slice(0, 3);

      const cursos = top3CursosFiltrados.map((curso) => curso.curso);
      const cantidad = top3CursosFiltrados.map((curso) => curso.cantidad);

      setCursosTop(cursos);
      setCantidadTop(cantidad);
    }
  }, [selectedNumeroAlumnos]);

  const handleCursoAprobadoChange = (event) => {
    setSelectedCursoAprobado(event.target.value);
  };

  const handleSemestreAprobadoChange = (event) => {
    setSelectedSemestreAprobado(event.target.value);
  };

  const handleSemestrePromedioChange = (event) => {
    setSelectedSemestrePromedio(event.target.value);
  };

  const handleNumeroAlumnosChange = (event) => {
    setselectedNumeroAlumnos(event.target.value);
  };


  const updateCharts = (selectedIp, response) => {

    if (aprobadosChart.current) {
      const aprobados = notasFiltradasAprobados.filter((nota) => nota.nota >= 61).length;
      const reprobados = notasFiltradasAprobados.length - aprobados;

      aprobadosChart.current.data.datasets[0].data = [aprobados, reprobados];
      aprobadosChart.current.update();
  };
};

  const plotCharts = () => {
    // Destruye los gráficos existentes
    if (aprobadosChart.current) {
      aprobadosChart.current.destroy();
    }

    
    aprobadosChart.current = new Chart(document.getElementById('aprobadosChart'), {
      type: 'pie',
      data: {
        labels: ['# de Aprobados', '# de Reprobados'],
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
            text: 'Porcentaje de Aprobados y Reprobados',
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


  const colorBlanco = {
    color: 'white',
    };
 

return (
  <>
    <NavBar />
    <h1>Notas Estáticas en MySql</h1>
    <div style={{ width: '90%', margin: '0 auto', padding: '0 5%' }}>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table className="table">
          <thead style={{ background: '#212529', color: 'white' }}>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Carnet</th>
              <th scope="col">Nombre</th>
              <th scope="col">Curso</th>
              <th scope="col">Nota</th>
              <th scope="col">Semestre</th>
              <th scope="col">Año</th>
            </tr>
          </thead>
          <tbody className="table-group-divider" style={colorBlanco}>
            {notas.map((album, index) => (
              <tr key={index}>
                <th style={{ background: '#212529', color: 'white' }} scope="row">{index + 1}</th>
                <td>{album.carnet}</td>
                <td>{album.nombre}</td>
                <td>{album.curso}</td>
                <td>{album.nota}</td>
                <td>{album.semestre}</td>
                <td>{album.anio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '40px 60px',maxWidth: '500px'  }}>
      <h3 style={{ marginTop: '0' }}>% de Aprobación de un Curso</h3>
      <div style={{ display: 'flex' }}>
        <select value={selectedCursoAprobado} onChange={handleCursoAprobadoChange} className="custom-select centered" style={{ width: '250px', marginRight: '10px' }}>
          <option value="">Selecciona un Curso</option>
          {cursos.length > 0 && cursos.map((curso, index) => (
            <option key={index} value={curso.value}>
              {curso.label}
            </option>
          ))}
        </select>
        <select value={selectedSemestreAprobado} onChange={handleSemestreAprobadoChange} className="custom-select centered" style={{ width: '250px' }}>
          <option value="">Selecciona un Semestre</option>
          {semestre.length > 0 && semestre.map((se, index) => (
            <option key={index} value={se.value}>
              {se.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ flex: 1, margin: '5px', maxWidth: '400px' }}>
        <canvas id="aprobadosChart" width="400" height="400"></canvas>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '40px 60px',maxWidth: '500px' }}>
      <h3 style={{ marginTop: '0' }}>Alumnos con Mejor Promedio</h3>
      <div style={{ display: 'flex' }}>
        <select value={selectedSemestrePromedio} onChange={handleSemestrePromedioChange} className="custom-select centered" style={{ width: '250px', marginRight: '10px' }}>
          <option value="">Selecciona un Semestre</option>
          {semestre.length > 0 && semestre.map((se, index) => (
            <option key={index} value={se.value}>
              {se.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ flex: 1, margin: '5px' }}>
        <Lineal carnets={topCarnetsPromedio} promedios={topPromedios} width="400" height="400" />
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '40px 60px',maxWidth: '500px' }}>
      <h3 style={{ marginTop: '0' }}>Cursos con Mayor No. de Alumnos</h3>
      <div style={{ display: 'flex' }}>
        <select value={selectedNumeroAlumnos} onChange={handleNumeroAlumnosChange} className="custom-select centered" style={{ width: '250px', marginRight: '10px' }}>
          <option value="">Selecciona un Semestre</option>
          {semestre.length > 0 && semestre.map((se, index) => (
            <option key={index} value={se.value}>
              {se.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ flex: 1, margin: '5px' }}>
        <Lineal carnets={cursosTop} promedios={cantidadTop} width="400" height="400" />
      </div>
    </div>
  </div>
  </>
);


}

export default Index;
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

function Horizontal ({carnets,promedios}) {
    console.log(carnets);
    console.log(promedios);
    const dataChart = {
        labels: carnets.map(item => item),
        datasets : [
            {
                label : '',
                color: 'white',
                data : promedios.map(item => item),
                backgroundColor : 'rgba(75,192,192,0.6)',
                borderColor : 'rgba(75,192,192,1)',
                borderWidth : 2,
                fill : true,
            },
        ],
    };

    const options = {
      maintainAspectRatio: false,
      indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            display: false,
          },
          title: {
            display: true,
            text: 'Cursos vs Cantidad de Estudiantes',
            color: 'white',
          },
        },
        scales: {
            x: {
              grid: {
                color: 'white', // Configura el color de las líneas de la cuadrícula del eje x
                display: false
              },
              ticks: {
                color: 'white', // Configura el color de las etiquetas del eje x
              },
            },
            y: {
              grid: {
                color: 'white', // Configura el color de las líneas de la cuadrícula del eje y
                display: false
              },
              ticks: {
                color: 'white', // Configura el color de las etiquetas del eje y
              },
            },
          },
      };

    return (
        <div style={{ width: '1200px', height: '550px'}}>
            <Bar data = {dataChart} options = {options} />
        </div>
    );
};

export default Horizontal;
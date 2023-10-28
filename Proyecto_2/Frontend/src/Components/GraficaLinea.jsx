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

function Lineal ({carnets,promedios}) {
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
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            display: false,
          },
          title: {
            display: false,
            text: '% de Uso',
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
        <div style={{ width: '600px', height: '400px'}}>
            <Bar data = {dataChart} options = {options} />
        </div>
    );
};

export default Lineal;
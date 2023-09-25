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
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

function Lineal ({data}) {
    const dataChart = {
        labels: data.map(item => {
            const fechaOriginal = new Date(item.fecha);
            const opcionesDeFormato = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            };
            return fechaOriginal.toLocaleDateString('es-ES', opcionesDeFormato);
        }),
        datasets : [
            {
                label : 'Uso',
                color: 'white',
                data : data.map(item => item.uso),
                backgroundColor : 'rgba(75,192,192,0.6)',
                borderColor : 'rgba(75,192,192,1)',
                borderWidth : 2,
                fill : true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
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
        <div>
            <Line data = {dataChart} options = {options} />
        </div>
    );
};

export default Lineal;
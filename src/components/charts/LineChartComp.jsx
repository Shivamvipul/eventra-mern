import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function LineChartComp({ labels, data, label = 'Registrations', color = '#6D3FD1' }) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label,
            data,
            borderColor: color,
            backgroundColor: `${color}33`,
            tension: 0.35,
            fill: true,
          },
        ],
      }}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  );
}

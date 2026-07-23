import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChartComp({ labels, data, label = 'Count', color = '#F59E0B' }) {
  return (
    <Bar
      data={{ labels, datasets: [{ label, data, backgroundColor: color, borderRadius: 6 }] }}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  );
}

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = ['#6D3FD1', '#F59E0B', '#059669', '#DC2626', '#0EA5E9', '#A855F7'];

export default function PieChartComp({ labels, data }) {
  return (
    <Pie
      data={{ labels, datasets: [{ data, backgroundColor: PALETTE }] }}
      options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
    />
  );
}

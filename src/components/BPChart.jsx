// components/BPChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title } from 'chart.js';

// Register components from Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, Title);

const BPChart = ({ data }) => {
  const chartData = {
    labels: data.map(entry => entry.timestamp.toDate().toLocaleDateString()), // Convert timestamp to readable date
    datasets: [
      {
        label: 'Systolic BP',
        data: data.map(entry => entry.systolic),
        borderColor: 'red',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
      {
        label: 'Diastolic BP',
        data: data.map(entry => entry.diastolic),
        borderColor: 'blue',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
      },
    ],
  };

  return (
    <div className="w-full h-64">
      <Line data={chartData} />
    </div>
  );
};

export default BPChart;

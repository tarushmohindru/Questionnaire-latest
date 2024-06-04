import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

const BubbleChart = ({ onImageGenerated }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartCanvas = chartRef.current;
    const chartInstance = new Chart(chartCanvas, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'First Dataset',
          data: [
            { x: 20, y: 30, r: 15 },
            { x: 40, y: 10, r: 10 }
          ],
          backgroundColor: 'rgb(255, 99, 132)'
        }]
      },
      options: {}
    });

    const image = chartInstance.toBase64Image();
    onImageGenerated(image);

    return () => {
      chartInstance.destroy();
    };
  }, [onImageGenerated]);

  return <canvas ref={chartRef} style={{ display: 'none' }} width="400" height="400" />;
};

export default BubbleChart;

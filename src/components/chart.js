import React, { useRef, useState, useEffect } from "react";
import { Bubble } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import html2canvas from "html2canvas";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

Chart.register(...registerables);

const ChartComponent = () => {
  const chartRef = useRef(null);
  const navigate = useNavigate();

  const data = {
    datasets: [
      {
        label: "E1",
        data: [{ x: 2, y: 7, r: 15 }],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "E2",
        data: [{ x: 2, y: 4, r: 15 }],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "E3",
        data: [{ x: 5, y: 8, r: 15 }],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "G1",
        data: [{ x: 1, y: 5, r: 15 }],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "G2",
        data: [{ x: 3, y: 3, r: 15 }],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "G3",
        data: [{ x: 10, y: 11, r: 15 }],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "S1",
        data: [{ x: 4, y: 6, r: 15 }],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "S2",
        data: [{ x: 4, y: 7, r: 15 }],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "S3",
        data: [{ x: 5, y: 6, r: 15 }],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "Overall",
        data: [{ x: 4, y: 5, r: 25 }],
        backgroundColor: "rgba(201, 203, 207, 0.6)",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Performance",
        },
        ticks: {
          callback: (value) => {
            if (value <= 4) return "Lagging";
            if (value > 4 && value <= 8) return "Advanced";
            return "Authentic";
          },
        },
        grid: {
          drawOnChartArea: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Confidence",
        },
        grid: {
          drawOnChartArea: true,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: (${context.raw.x}, ${context.raw.y})`;
          },
        },
      },
    },
  };

  useEffect(() => {
    const captureChartAsImage = () => {
      const chartElement = chartRef.current;
      html2canvas(chartElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
      });
    };

    captureChartAsImage();
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          navigate("/home");
        }}
      >
        Dashboard
      </Button>
      <div ref={chartRef}>
        <Bubble data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartComponent;

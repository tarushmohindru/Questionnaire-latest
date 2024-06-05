import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
const RadarChart = () => {
  const data = {
    labels: [
      "conf",
      "e_conf",
      "e_perf",
      "e_weight",
      "g_conf",
      "g_perf",
      "g_weight",
      "perf",
      "s_conf",
      "s_perf",
      "s_weight",
    ],
    datasets: [
      {
        label: "Dataset",
        data: [
          0.05724296911018902, 0, 2.499, 0.867, 0.17777777777777778,
          2.2964444444444445, 0.776, 2.258737298294145, 0, 1.9490000000000003,
          0.767,
        ],
        backgroundColor: "#FEECD2",
        borderColor: "#FFBC58",
        pointBackgroundColor: "#FFBC58",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#FFBC58",
      },
    ],
  };
  const options = {
    scale: {
      ticks: { beginAtZero: true },
    },
  };
  return <Radar data={data} options={options} />;
};
export default RadarChart;

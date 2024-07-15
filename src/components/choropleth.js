import React, { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { ChoroplethController, GeoFeature } from "chartjs-chart-geo";
import { feature } from "topojson-client";
import "chartjs-chart-geo";

Chart.register(...registerables, ChoroplethController, GeoFeature);

function ChoroplethMap() {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    fetch("https://unpkg.com/world-atlas/countries-50m.json")
      .then((response) => response.json())
      .then((data) => {
        const countries = feature(data, data.objects.countries).features;

        const chart = new Chart(ctx, {
          type: "choropleth",
          data: {
            labels: countries.map((d) => d.properties.name),
            datasets: [
              {
                label: "Countries",
                data: countries.map((d) => ({
                  feature: d,
                  value: Math.random() * 100,
                })),
              },
            ],
          },
          options: {
            showOutline: true,
            showGraticule: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              projection: {
                axis: "x",
                projection: "equalEarth",
              },
            },
          },
        });

        return () => {
          chart.destroy();
        };
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return <canvas ref={chartRef} />;
}

export default ChoroplethMap;

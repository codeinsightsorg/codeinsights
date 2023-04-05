import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function ChartComponent({ config }) {
  const chartCanvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const renderChart = () => {
      if (chartCanvasRef.current && config) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(chartCanvasRef.current, {
          type: config.chartType,
          data: {
            labels: config.labels.slice(-20),
            datasets: [
              {
                label: config.key,
                fill: true,
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: config.values.slice(-20),
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: "#9a9a9a",
                },
                grid: {
                  color: "rgba(29,140,248,0.0)",
                },
              },

              x: {
                grid: {
                  color: "rgba(225,78,202,0.1)",
                },
                ticks: {
                  color: "#9a9a9a",
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "#fff",
                },
              },
            },
          },
        });
      }
    };

    renderChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [config]);

  return <canvas ref={chartCanvasRef}></canvas>;
}

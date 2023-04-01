<script lang="ts" setup>
import {ref, onMounted, watch} from 'vue';
import {Chart, ChartConfiguration} from 'chart.js/auto';

const props = defineProps<{
  config: any;
}>()
const chartCanvas = ref<any>(null);
let chartInstance: Chart | null = null;
console.log(props.config)
const renderChart = () => {
  if (chartCanvas.value && props.config) {
    if (chartInstance) {
      chartInstance.destroy();
    }
    chartInstance = new Chart(chartCanvas.value, {
      type: props.config.chartType,
      data: {
        labels: props.config.labels.slice(-20),
        datasets: [
          {
            label: props.config.key,
            fill: true,
            backgroundColor: "rgba(72,72,176,0.2)",
            borderColor: "#d048b6",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: "#d048b6",
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: "#d048b6",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: props.config.values.slice(-20),
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#9a9a9a',
            },
            grid: {
              color: 'rgba(29,140,248,0.0)',
            }
          },

          x: {
            grid: {
              color: 'rgba(225,78,202,0.1)',
            },
            ticks: {
              color: '#9a9a9a',
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#fff'
            }
          }
        }
      }
    });
  }
};

onMounted(() => {
  renderChart();
});

watch(() => props.config, renderChart, { deep: true });
</script>

<template>
  <canvas ref="chartCanvas"></canvas>
</template>


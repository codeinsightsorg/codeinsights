<script lang="ts" setup>
import {ref, onMounted, watch} from 'vue';
import {Chart, ChartConfiguration} from 'chart.js/auto';

const props = defineProps<{
  config: ChartConfiguration;
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
      ...props.config,
      options: {
        scales: {
          y: {
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


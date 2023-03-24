<script setup lang="ts">
import plugins from '@/assets/charts.json';

import Chart from "@/components/charts/Chart.vue";
console.log(plugins)
</script>

<template>
  <div class="plugins">
    <div class="plugin" v-for="(plugin, index) of plugins" :key="index">
      <h1 class="plugin-name">{{plugin.name}}</h1>
      <div class="analyzed-item-type-container" v-for="(value, type) in plugin.charts" :key="type">
        <h2 class="type-name">{{type}}</h2>
        <div class="charts">
          <div class="chart" v-for="(chart, index) of value" :key="index">
            <Chart :config="chart" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.plugin-name {
  font-weight: 700;
  text-align: center;
  margin-top: 16px;
}

.type-name {
  background-color: #f7df1e;
  width: fit-content;
  color: #333333;
  border-radius: 4px;
  padding: 2px 4px;
  font-weight: 600;
}

.type-name {
  margin-top: 16px;
}

.plugin-name:not(:first-child) {
  margin-top: 16px;
}
</style>

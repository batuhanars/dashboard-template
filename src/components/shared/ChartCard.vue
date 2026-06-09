<script setup lang="ts">
import '@/lib/chart-register'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

const props = defineProps<{
  title: string
  type: 'line' | 'bar' | 'doughnut'
  data: ChartData
  options?: ChartOptions
  height?: string
}>()

const { isDark } = useTheme()

const chartKey = computed(() => `${props.type}-${isDark.value ? 'd' : 'l'}`)

const mergedOptions = computed<ChartOptions>(() => {
  const gridColor = isDark.value ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const tickColor = isDark.value ? '#94a3b8' : '#94a3b8'

  const base: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { labels: { color: tickColor, boxWidth: 10, font: { size: 11 } } },
      tooltip: { mode: 'index', intersect: false },
    },
  }

  if (props.type !== 'doughnut') {
    ;(base as ChartOptions & { scales: object }).scales = {
      x: { grid: { color: gridColor }, border: { display: false }, ticks: { color: tickColor, font: { size: 11 } } },
      y: { grid: { color: gridColor }, border: { display: false }, ticks: { color: tickColor, font: { size: 11 } } },
    }
  }

  return { ...base, ...props.options }
})
</script>

<template>
  <div class="rounded-xl bg-muted/60 dark:bg-muted/40 px-5 py-4 transition-all duration-150">
    <p class="text-muted-foreground mb-4 text-xs font-semibold uppercase tracking-widest">{{ title }}</p>
    <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
    <div :class="height ?? 'h-52'">
      <Line    v-if="type === 'line'"     :key="chartKey" :data="data as any" :options="mergedOptions as any" />
      <Bar     v-else-if="type === 'bar'" :key="chartKey" :data="data as any" :options="mergedOptions as any" />
      <Doughnut v-else                    :key="chartKey" :data="data as any" :options="mergedOptions as any" />
    </div>
  </div>
</template>

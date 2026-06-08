<script setup lang="ts">
import '@/lib/chart-register'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

const props = defineProps<{
  title: string
  type: 'line' | 'bar' | 'doughnut'
  data: ChartData
  options?: ChartOptions
}>()

const { isDark } = useTheme()

// key değişince chart yeniden mount edilir — dark mode renk geçişi için
const chartKey = computed(() => `${props.type}-${isDark.value ? 'd' : 'l'}`)

const mergedOptions = computed<ChartOptions>(() => {
  const gridColor = isDark.value ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const tickColor = isDark.value ? '#a1a1aa' : '#71717a'

  const base: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        labels: { color: tickColor, boxWidth: 12, font: { size: 11 } },
      },
      tooltip: { mode: 'index', intersect: false },
    },
  }

  if (props.type !== 'doughnut') {
    ;(base as ChartOptions & { scales: object }).scales = {
      x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } },
      y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } },
    }
  }

  return { ...base, ...props.options }
})
</script>

<template>
  <Card>
    <CardHeader class="pb-2">
      <CardTitle class="text-sm font-semibold">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
      <div class="h-60">
        <Line
          v-if="type === 'line'"
          :key="chartKey"
          :data="data as any"
          :options="mergedOptions as any"
        />
        <Bar
          v-else-if="type === 'bar'"
          :key="chartKey"
          :data="data as any"
          :options="mergedOptions as any"
        />
        <Doughnut v-else :key="chartKey" :data="data as any" :options="mergedOptions as any" />
      </div>
    </CardContent>
  </Card>
</template>

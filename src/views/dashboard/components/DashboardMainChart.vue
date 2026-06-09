<script setup lang="ts">
import '@/lib/chart-register'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import type { KpiMetric } from '@/types/api'

const props = defineProps<{
  series: Array<{ date: string; value: number }>
  metrics: KpiMetric[]
}>()

const { t } = useI18n()
const { isDark } = useTheme()

const activeTab = ref(0)

const tabs = computed(() =>
  props.metrics.map((m) => ({ key: m.key, label: t(`dashboard.kpi.${m.key}`) })),
)

const chartKey = computed(() => `main-${isDark.value ? 'd' : 'l'}-${activeTab.value}`)

const chartData = computed<ChartData>(() => {
  const full = props.series
  if (!full.length) return { labels: [], datasets: [] }

  const half = Math.floor(full.length / 2)
  const prev = full.slice(0, half)
  const curr = full.slice(half)

  const metric = props.metrics[activeTab.value]
  const currMax = Math.max(...curr.map((p) => p.value)) || 1
  const scale = metric ? metric.value / currMax : 1

  const labels = curr.map((p, i) => (i % 3 === 0 ? p.date.slice(5) : ''))

  const dashFrom = Math.floor(curr.length * 0.75)

  const currentColor = isDark.value ? '#e2e8f0' : '#1e293b'
  const previousColor = isDark.value ? '#93c5fd' : '#bfdbfe'

  return {
    labels,
    datasets: [
      {
        label: t('dashboard.chart.currentPeriod'),
        data: curr.map((p) => Math.round(p.value * scale)),
        borderColor: currentColor,
        borderWidth: 2.5,
        tension: 0.45,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: currentColor,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        segment: { borderDash: (ctx: any) => (ctx.p0DataIndex >= dashFrom ? [7, 4] : undefined) },
      },
      {
        label: t('dashboard.chart.previousPeriod'),
        data: prev.map((p) => Math.round(p.value * scale * 0.82)),
        borderColor: previousColor,
        borderWidth: 2,
        tension: 0.45,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: previousColor,
      },
    ],
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => {
  const gridColor = isDark.value ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const tickColor = isDark.value ? '#94a3b8' : '#94a3b8'

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: tickColor,
          boxWidth: 8,
          boxHeight: 8,
          borderRadius: 4,
          useBorderRadius: true,
          font: { size: 11 },
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: isDark.value ? '#1e293b' : '#ffffff',
        titleColor: isDark.value ? '#f1f5f9' : '#0f172a',
        bodyColor: isDark.value ? '#94a3b8' : '#64748b',
        borderColor: isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: tickColor, font: { size: 11 }, maxRotation: 0 },
      },
      y: {
        grid: { color: gridColor },
        border: { display: false, dash: [4, 4] },
        ticks: { color: tickColor, font: { size: 11 } },
      },
    },
  }
})
</script>

<template>
  <div class="rounded-xl bg-muted/60 dark:bg-muted/40">
    <!-- Header: tabs -->
    <div class="flex flex-wrap items-center gap-x-1 gap-y-2 border-b border-border/40 px-5 py-3">
      <button
        v-for="(tab, i) in tabs"
        :key="tab.key"
        class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
        :class="activeTab === i
          ? 'bg-accent text-foreground'
          : 'text-muted-foreground hover:text-foreground'"
        @click="activeTab = i"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Chart -->
    <div class="h-64 px-2 py-4">
      <Line :key="chartKey" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

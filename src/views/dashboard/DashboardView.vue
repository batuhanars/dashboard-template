<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/lib/api'
import { formatCurrency, formatNumber } from '@/lib/format'
import type { ChartData } from 'chart.js'
import type { KpiMetric } from '@/types/api'

import DashboardRecentTransactions from './components/DashboardRecentTransactions.vue'
import DashboardMainChart from './components/DashboardMainChart.vue'

const { t } = useI18n()
const { isDark } = useTheme()

const { data, isPending } = useQuery({
  queryKey: ['dashboard', 'summary'],
  queryFn: () => api.dashboard.summary(),
})

function formatKpiValue(metric: KpiMetric): string {
  if (metric.key === 'revenue') return formatCurrency(metric.value)
  if (metric.key === 'conversion') return `${metric.value.toFixed(1)}%`
  return formatNumber(metric.value)
}

// Her 7. noktayı alarak haftalık özet bar chart
const weeklyRevenueChartData = computed<ChartData>(() => {
  const series = data.value?.revenueSeries ?? []
  const weekly = series.filter((_, i) => i % 7 === 0).slice(-10)
  const barColor = isDark.value ? 'rgba(129,140,248,0.75)' : 'rgba(99,102,241,0.75)'
  const barHover = isDark.value ? 'rgba(129,140,248,0.9)' : 'rgba(99,102,241,0.9)'
  return {
    labels: weekly.map((p) => p.date.slice(5)),
    datasets: [
      {
        label: t('dashboard.chart.weeklyRevenue'),
        data: weekly.map((p) => p.value),
        backgroundColor: barColor,
        hoverBackgroundColor: barHover,
        borderRadius: 5,
        borderWidth: 0,
      },
    ],
  }
})

// İşlem durumu dağılımı doughnut
const txDistributionChartData = computed<ChartData>(() => {
  const txs = data.value?.recentTransactions ?? []
  const counts = { completed: 0, pending: 0, failed: 0 }
  for (const tx of txs) {
    if (tx.status in counts) counts[tx.status as keyof typeof counts]++
  }
  return {
    labels: [
      t('dashboard.txStatus.completed'),
      t('dashboard.txStatus.pending'),
      t('dashboard.txStatus.failed'),
    ],
    datasets: [
      {
        data: [counts.completed, counts.pending, counts.failed],
        backgroundColor: [
          'rgba(16,185,129,0.85)',
          'rgba(245,158,11,0.85)',
          'rgba(239,68,68,0.85)',
        ],
        hoverBackgroundColor: [
          'rgba(16,185,129,1)',
          'rgba(245,158,11,1)',
          'rgba(239,68,68,1)',
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }
})
</script>

<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-foreground text-xl font-bold tracking-tight">{{ $t('nav.dashboard') }}</h1>
      <p class="text-muted-foreground mt-0.5 text-sm">{{ $t('dashboard.subtitle') }}</p>
    </div>

    <template v-if="isPending">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card v-for="i in 4" :key="i">
          <CardContent class="p-5">
            <Skeleton class="mb-3 h-3 w-20" />
            <Skeleton class="h-9 w-28" />
          </CardContent>
        </Card>
      </div>
      <div class="grid gap-5 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <Skeleton class="h-72 rounded-xl" />
        </div>
        <Skeleton class="h-72 rounded-xl" />
      </div>
      <div class="grid gap-5 sm:grid-cols-2">
        <Skeleton class="h-60 rounded-xl" />
        <Skeleton class="h-60 rounded-xl" />
      </div>
    </template>

    <template v-else-if="data">
      <!-- Stat kartları -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          v-for="(metric, i) in data.metrics"
          :key="metric.key"
          :label="$t(`dashboard.kpi.${metric.key}`)"
          :value="formatKpiValue(metric)"
          :delta-pct="metric.deltaPct"
          :color="(['sky', 'violet', 'teal', 'rose'] as const)[i % 4]"
        />
      </div>

      <!-- İlk satır: karşılaştırmalı grafik + işlemler -->
      <div class="grid gap-5 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-5">
          <DashboardMainChart :series="data.revenueSeries" :metrics="data.metrics" />
          <!-- İkinci satır: bar + doughnut -->
          <div class="grid gap-5 sm:grid-cols-2">
            <ChartCard :title="$t('dashboard.chart.weeklyRevenue')"  type="bar"      :data="weeklyRevenueChartData" />
            <ChartCard :title="$t('dashboard.chart.txDistribution')" type="doughnut" :data="txDistributionChartData" />
          </div>
        </div>
        <DashboardRecentTransactions :transactions="data.recentTransactions" />
      </div>



    </template>
  </div>
</template>

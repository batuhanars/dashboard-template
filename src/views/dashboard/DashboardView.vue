<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/lib/api'
import { formatCurrency, formatNumber } from '@/lib/format'
import type { ChartData } from 'chart.js'
import type { KpiMetric } from '@/types/api'

import DashboardRecentTransactions from './components/DashboardRecentTransactions.vue'
import DashboardMainChart from './components/DashboardMainChart.vue'
import DashboardTxDistribution from './components/DashboardTxDistribution.vue'

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
  const palette = [
    'rgba(147,141,216,0.85)',
    'rgba(152,216,181,0.85)',
    'rgba(129,177,216,0.85)',
    'rgba(216,168,147,0.85)',
    'rgba(180,152,216,0.85)',
    'rgba(152,197,170,0.85)',
    'rgba(216,195,141,0.85)',
    'rgba(141,197,216,0.85)',
    'rgba(197,152,216,0.85)',
    'rgba(152,216,196,0.85)',
  ]
  return {
    labels: weekly.map((p) => p.date.slice(5)),
    datasets: [
      {
        label: t('dashboard.chart.weeklyRevenue'),
        data: weekly.map((p) => p.value),
        backgroundColor: weekly.map((_, i) => palette[i % palette.length]),
        hoverBackgroundColor: weekly.map((_, i) => palette[i % palette.length].replace('0.85', '1')),
        borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
        borderWidth: 0,
        barPercentage: 0.45,
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
  const darkSegment = isDark.value ? 'rgba(226,232,240,0.85)' : 'rgba(45,47,62,0.85)'
  const darkSegmentHover = isDark.value ? 'rgba(226,232,240,1)' : 'rgba(45,47,62,1)'
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
          'rgba(147,141,216,0.9)',
          'rgba(152,216,181,0.9)',
          darkSegment,
        ],
        hoverBackgroundColor: [
          'rgba(147,141,216,1)',
          'rgba(152,216,181,1)',
          darkSegmentHover,
        ],
        borderWidth: 3,
        borderColor: isDark.value ? '#3c3c46' : '#f4f4f6',
        spacing: 0,
        hoverOffset: 6,
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
          :variant="i % 2 === 0 ? 'a' : 'b'"
        />
      </div>

      <!-- İlk satır: karşılaştırmalı grafik + işlemler -->
      <div class="grid gap-5 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-5">
          <DashboardMainChart :series="data.revenueSeries" :metrics="data.metrics" />
          <!-- İkinci satır: bar + doughnut -->
          <div class="grid gap-5 sm:grid-cols-2">
            <ChartCard :title="$t('dashboard.chart.weeklyRevenue')"  type="bar" :data="weeklyRevenueChartData" />
            <DashboardTxDistribution :data="txDistributionChartData" />
          </div>
        </div>
        <DashboardRecentTransactions :transactions="data.recentTransactions" />
      </div>



    </template>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/lib/api'
import { formatCurrency, formatNumber } from '@/lib/format'
import { DollarSign, Users, ShoppingCart, Percent } from 'lucide-vue-next'
import type { ChartData } from 'chart.js'
import type { KpiMetric } from '@/types/api'
import type { Component } from 'vue'
import DashboardRecentTransactions from './components/DashboardRecentTransactions.vue'

const { t } = useI18n()
const { isDark } = useTheme()

const { data, isPending } = useQuery({
  queryKey: ['dashboard', 'summary'],
  queryFn: () => api.dashboard.summary(),
})

const kpiIcons: Record<string, Component> = {
  revenue: DollarSign,
  users: Users,
  orders: ShoppingCart,
  conversion: Percent,
}

function formatKpiValue(metric: KpiMetric): string {
  if (metric.key === 'revenue') return formatCurrency(metric.value)
  if (metric.key === 'conversion') return `${metric.value.toFixed(1)}%`
  return formatNumber(metric.value)
}

const revenueChartData = computed<ChartData>(() => {
  const series = data.value?.revenueSeries ?? []
  const color = isDark.value ? '#818cf8' : '#6366f1'
  return {
    labels: series.map((p) => p.date.slice(5)),
    datasets: [
      {
        label: t('dashboard.chart.revenue'),
        data: series.map((p) => p.value),
        borderColor: color,
        backgroundColor: isDark.value ? 'rgba(129,140,248,0.12)' : 'rgba(99,102,241,0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  }
})
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-foreground text-2xl font-semibold">{{ $t('nav.dashboard') }}</h1>

    <template v-if="isPending">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card v-for="i in 4" :key="i">
          <CardContent class="p-5">
            <Skeleton class="mb-2 h-3 w-24" />
            <Skeleton class="h-8 w-32" />
            <Skeleton class="mt-2 h-3 w-16" />
          </CardContent>
        </Card>
      </div>
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2"><Skeleton class="h-80 rounded-lg" /></div>
        <Skeleton class="h-80 rounded-lg" />
      </div>
    </template>

    <template v-else-if="data">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          v-for="metric in data.metrics"
          :key="metric.key"
          :label="$t(`dashboard.kpi.${metric.key}`)"
          :value="formatKpiValue(metric)"
          :delta-pct="metric.deltaPct"
          :icon="kpiIcons[metric.key]"
        />
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <ChartCard :title="$t('dashboard.chart.revenue')" type="line" :data="revenueChartData" />
        </div>
        <DashboardRecentTransactions :transactions="data.recentTransactions" />
      </div>
    </template>
  </div>
</template>

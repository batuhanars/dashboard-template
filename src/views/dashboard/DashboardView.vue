<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/lib/api'
import { formatCurrency, formatNumber, formatDate } from '@/lib/format'
import { DollarSign, Users, ShoppingCart, Percent } from 'lucide-vue-next'
import type { ChartData } from 'chart.js'
import type { KpiMetric } from '@/types/api'
import type { Component } from 'vue'

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

const txStatusClass: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  failed: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-foreground text-2xl font-semibold">{{ $t('nav.dashboard') }}</h1>

    <!-- Loading skeleton -->
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
      <!-- KPI kartları -->
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

      <!-- Grafik + Son işlemler -->
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Gelir grafiği -->
        <div class="lg:col-span-2">
          <ChartCard :title="$t('dashboard.chart.revenue')" type="line" :data="revenueChartData" />
        </div>

        <!-- Son işlemler -->
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-sm font-semibold">
              {{ $t('dashboard.recentTransactions') }}
            </CardTitle>
          </CardHeader>
          <CardContent class="px-0 pb-0">
            <ul class="divide-border divide-y">
              <li
                v-for="tx in data.recentTransactions"
                :key="tx.id"
                class="flex items-center justify-between px-4 py-3"
              >
                <div class="min-w-0">
                  <p class="text-foreground truncate text-sm font-medium">
                    {{ tx.customerName }}
                  </p>
                  <p class="text-muted-foreground text-xs">{{ formatDate(tx.createdAt) }}</p>
                </div>
                <div class="ml-3 shrink-0 text-right">
                  <p class="text-foreground text-sm font-semibold">
                    {{ formatCurrency(tx.amount, tx.currency) }}
                  </p>
                  <span
                    class="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                    :class="txStatusClass[tx.status]"
                  >
                    {{ $t(`dashboard.txStatus.${tx.status}`) }}
                  </span>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/lib/api'

const { data, isPending, isError } = useQuery({
  queryKey: ['dashboard', 'summary'],
  queryFn: () => api.dashboard.summary(),
})
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-foreground">{{ $t('nav.dashboard') }}</h1>

    <div v-if="isPending" class="text-sm text-muted-foreground">{{ $t('common.loading') }}</div>

    <div v-else-if="isError" class="text-sm text-destructive">{{ $t('common.error') }}</div>

    <template v-else-if="data">
      <!-- KPI Metrikleri -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="metric in data.metrics"
          :key="metric.key"
          class="rounded-lg border border-border bg-card p-4"
        >
          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {{ metric.key }}
          </p>
          <p class="mt-1 text-2xl font-bold text-card-foreground">
            {{ metric.key === 'conversion' ? metric.value.toFixed(1) + '%' : metric.value.toLocaleString('tr-TR') }}
          </p>
          <p
            class="mt-1 text-xs font-medium"
            :class="metric.deltaPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'"
          >
            {{ metric.deltaPct >= 0 ? '+' : '' }}{{ metric.deltaPct }}%
          </p>
        </div>
      </div>

      <!-- Son İşlemler -->
      <div class="rounded-lg border border-border bg-card">
        <div class="border-b border-border px-4 py-3">
          <h2 class="text-sm font-semibold text-card-foreground">Son İşlemler</h2>
        </div>
        <div class="divide-y divide-border">
          <div
            v-for="tx in data.recentTransactions"
            :key="tx.id"
            class="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p class="text-sm font-medium text-foreground">{{ tx.customerName }}</p>
              <p class="text-xs text-muted-foreground">{{ new Date(tx.createdAt).toLocaleDateString('tr-TR') }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-foreground">
                {{ tx.amount.toLocaleString('tr-TR') }} {{ tx.currency }}
              </p>
              <span
                class="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                :class="{
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': tx.status === 'completed',
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': tx.status === 'pending',
                  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400': tx.status === 'failed',
                }"
              >{{ tx.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <p class="text-xs text-muted-foreground">{{ $t('placeholder.dashboard') }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from '@/lib/format'
import type { Transaction } from '@/types/api'

defineProps<{ transactions: Transaction[] }>()

const txStatusClass: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  failed: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <CardTitle class="text-sm font-semibold">
        {{ $t('dashboard.recentTransactions') }}
      </CardTitle>
    </CardHeader>
    <CardContent class="px-0 pb-0">
      <ul class="divide-border divide-y">
        <li
          v-for="tx in transactions"
          :key="tx.id"
          class="flex items-center justify-between px-4 py-3"
        >
          <div class="min-w-0">
            <p class="text-foreground truncate text-sm font-medium">{{ tx.customerName }}</p>
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
</template>

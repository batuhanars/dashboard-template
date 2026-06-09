<script setup lang="ts">
import { formatCurrency, formatDate } from '@/lib/format'
import type { Transaction } from '@/types/api'

defineProps<{ transactions: Transaction[] }>()

const txStatusClass: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending:   'bg-amber-100   text-amber-700   dark:bg-amber-900/30   dark:text-amber-400',
  failed:    'bg-rose-100    text-rose-700    dark:bg-rose-900/30    dark:text-rose-400',
}
</script>

<template>
  <div class="rounded-xl bg-muted/60 dark:bg-muted/40 overflow-hidden">
    <!-- Başlık -->
    <div class="px-5 pt-5 pb-3 border-b border-border/40">
      <p class="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
        {{ $t('dashboard.recentTransactions') }}
      </p>
    </div>

    <!-- Liste -->
    <ul>
      <li
        v-for="tx in transactions"
        :key="tx.id"
        class="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-accent/50"
      >
        <!-- Avatar -->
        <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
          {{ tx.customerName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) }}
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-foreground truncate text-sm font-semibold">{{ tx.customerName }}</p>
          <p class="text-muted-foreground text-xs">{{ formatDate(tx.createdAt) }}</p>
        </div>

        <div class="shrink-0 text-right">
          <p class="text-foreground text-sm font-bold tabular-nums">
            {{ formatCurrency(tx.amount, tx.currency) }}
          </p>
          <span
            class="inline-block rounded-md px-1.5 py-0.5 text-xs font-semibold tracking-wide"
            :class="txStatusClass[tx.status]"
          >
            {{ $t(`dashboard.txStatus.${tx.status}`) }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

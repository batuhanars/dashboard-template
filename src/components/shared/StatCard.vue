<script setup lang="ts">
import { ArrowUpRight, ArrowDownRight } from 'lucide-vue-next'

defineProps<{
  label: string
  value: string
  deltaPct?: number
  variant?: 'a' | 'b'
}>()
</script>

<template>
  <div
    class="rounded-xl px-6 py-7 transition-all duration-150"
    :class="variant === 'b'
      ? 'bg-slate-200 dark:bg-slate-700'
      : 'bg-slate-100 dark:bg-slate-800'"
  >
    <p class="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {{ label }}
    </p>

    <div class="flex items-end gap-2">
      <span class="text-3xl font-bold tracking-tight tabular-nums text-foreground">{{ value }}</span>

      <span
        v-if="deltaPct !== undefined"
        class="mb-0.5 inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold"
        :class="deltaPct >= 0
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
          : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'"
      >
        {{ deltaPct >= 0 ? '+' : '' }}{{ deltaPct }}%
        <ArrowUpRight v-if="deltaPct >= 0" class="size-3 shrink-0" />
        <ArrowDownRight v-else class="size-3 shrink-0" />
      </span>
    </div>
  </div>
</template>

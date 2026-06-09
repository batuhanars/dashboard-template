<script setup lang="ts">
import { ArrowUpRight, ArrowDownRight } from 'lucide-vue-next'

const colorMap = {
  blue:    'bg-blue-100/50   dark:bg-blue-950/30',
  violet:  'bg-violet-100/50 dark:bg-violet-950/30',
  teal:    'bg-teal-100/50   dark:bg-teal-950/30',
  rose:    'bg-rose-100/50   dark:bg-rose-950/30',
  amber:   'bg-amber-100/50  dark:bg-amber-950/30',
  emerald: 'bg-emerald-100/50 dark:bg-emerald-950/30',
  sky:     'bg-sky-100/50    dark:bg-sky-950/30',
} as const

const props = defineProps<{
  label: string
  value: string
  deltaPct?: number
  color?: keyof typeof colorMap
}>()

const bgClass = computed(() => colorMap[props.color ?? 'blue'])
</script>

<template>
  <div class="rounded-xl px-6 py-7 transition-all duration-150" :class="bgClass">
    <p class="text-muted-foreground mb-4 text-xs font-semibold uppercase tracking-widest">
      {{ label }}
    </p>

    <div class="flex items-end gap-2">
      <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">{{ value }}</span>

      <span
        v-if="deltaPct !== undefined"
        class="mb-0.5 inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold"
        :class="deltaPct >= 0
          ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
          : 'bg-rose-100/80 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'"
      >
        {{ deltaPct >= 0 ? '+' : '' }}{{ deltaPct }}%
        <ArrowUpRight v-if="deltaPct >= 0" class="size-3 shrink-0" />
        <ArrowDownRight v-else class="size-3 shrink-0" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import type { Component } from 'vue'

defineProps<{
  label: string
  value: string
  deltaPct?: number
  icon?: Component
}>()
</script>

<template>
  <Card>
    <CardContent class="p-5">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {{ label }}
          </p>
          <p class="mt-1.5 text-2xl font-bold tabular-nums text-card-foreground">{{ value }}</p>

          <div v-if="deltaPct !== undefined" class="mt-1.5 flex items-center gap-1">
            <TrendingUp
              v-if="deltaPct >= 0"
              class="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <TrendingDown v-else class="size-3.5 shrink-0 text-rose-500" />
            <span
              class="text-xs font-medium"
              :class="deltaPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'"
            >
              {{ deltaPct >= 0 ? '+' : '' }}{{ deltaPct }}%
            </span>
          </div>
        </div>

        <div
          v-if="icon"
          class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
        >
          <component :is="icon" class="size-5" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>

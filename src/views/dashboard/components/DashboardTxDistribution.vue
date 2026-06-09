<script setup lang="ts">
import '@/lib/chart-register'
import { Doughnut } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

const props = defineProps<{
  data: ChartData
}>()

const { isDark } = useTheme()

const chartKey = computed(() => `doughnut-${isDark.value ? 'd' : 'l'}`)

const typedData = computed(() => props.data as ChartData<'doughnut'>)

const typedOptions = computed<ChartOptions<'doughnut'>>(() => ({
  cutout: '68%',
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false },
  },
}))

const legendItems = computed(() => {
  if (!props.data.labels || !props.data.datasets[0]) return []
  const ds = props.data.datasets[0] as unknown as Record<string, unknown>
  return (props.data.labels as string[]).map((label, i) => ({
    label,
    value: (ds.data as number[])[i],
    color: Array.isArray(ds.backgroundColor)
      ? (ds.backgroundColor as string[])[i]
      : (ds.backgroundColor as string),
  }))
})

const total = computed(() => legendItems.value.reduce((s, item) => s + item.value, 0))
</script>

<template>
  <div class="flex flex-col rounded-xl bg-muted/60 dark:bg-muted px-5 py-4 transition-all duration-150">
    <p class="text-muted-foreground mb-4 text-xs font-semibold uppercase tracking-widest">
      {{ $t('dashboard.chart.txDistribution') }}
    </p>
    <div class="flex flex-1 items-center gap-10 px-5">
      <!-- Donut -->
      <div class="min-h-0 w-36 shrink-0 self-stretch">
        <Doughnut :key="chartKey" :data="typedData" :options="typedOptions" />
      </div>

      <!-- Legend -->
      <div class="flex flex-1 flex-col justify-center gap-3.5">
        <div
          v-for="item in legendItems"
          :key="item.label"
          class="flex items-center gap-3"
        >
          <div class="flex min-w-0 flex-1 items-center gap-2">
            <span
              class="size-2.5 shrink-0 rounded-sm"
              :style="{ backgroundColor: item.color }"
            />
            <span class="truncate text-sm text-muted-foreground">{{ item.label }}</span>
          </div>
          <div class="flex shrink-0 flex-col items-end">
            <span class="tabular-nums text-sm font-semibold text-foreground">{{ item.value }}</span>
            <span class="text-xs text-muted-foreground/60 tabular-nums">
              {{ total > 0 ? Math.round((item.value / total) * 100) : 0 }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

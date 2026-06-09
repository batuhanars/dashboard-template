<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-vue-next'

export type DateRange = 'today' | 'week' | 'month' | 'year' | 'custom'
export type CustomRange = { from: string; to: string }

const props = defineProps<{
  modelValue: DateRange
  customRange?: CustomRange
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DateRange]
  'update:customRange': [value: CustomRange]
}>()

const { t, locale } = useI18n()
const localeCode = computed(() => localeCode.value)

const presets: { value: DateRange; labelKey: string }[] = [
  { value: 'today', labelKey: 'dashboard.filter.today' },
  { value: 'week',  labelKey: 'dashboard.filter.week' },
  { value: 'month', labelKey: 'dashboard.filter.month' },
  { value: 'year',  labelKey: 'dashboard.filter.year' },
]

// ── Calendar state ────────────────────────────────────────────────
const showPicker = ref(false)
const pickerRef  = ref<HTMLElement | null>(null)
const leftYear   = ref(new Date().getFullYear())
const leftMonth  = ref(new Date().getMonth())
const startDate  = ref<Date | null>(null)
const endDate    = ref<Date | null>(null)
const hovered    = ref<Date | null>(null)
const selecting  = ref(false)

const rightYear  = computed(() => leftMonth.value === 11 ? leftYear.value + 1 : leftYear.value)
const rightMonth = computed(() => (leftMonth.value + 1) % 12)

onClickOutside(pickerRef, () => { showPicker.value = false })

watch(showPicker, (open) => {
  if (!open) return
  if (props.customRange) {
    startDate.value = new Date(props.customRange.from + 'T00:00:00')
    endDate.value   = new Date(props.customRange.to   + 'T00:00:00')
    selecting.value = false
  } else {
    startDate.value = null
    endDate.value   = null
    selecting.value = false
  }
  leftYear.value  = new Date().getFullYear()
  leftMonth.value = new Date().getMonth()
})

// ── Date helpers ──────────────────────────────────────────────────
function toStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getGrid(year: number, month: number): { date: Date; current: boolean }[] {
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: { date: Date; current: boolean }[] = []
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ date: new Date(year, month, -i), current: false })
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(year, month, d), current: true })
  const rem = 42 - cells.length
  for (let d = 1; d <= rem; d++)
    cells.push({ date: new Date(year, month + 1, d), current: false })
  return cells
}

const leftGrid  = computed(() => getGrid(leftYear.value, leftMonth.value))
const rightGrid = computed(() => getGrid(rightYear.value, rightMonth.value))

const effectiveEnd = computed(() => {
  if (endDate.value) return endDate.value
  if (selecting.value && hovered.value && startDate.value
      && toStr(hovered.value) >= toStr(startDate.value))
    return hovered.value
  return null
})

function dayState(date: Date) {
  const d = toStr(date)
  const s = startDate.value ? toStr(startDate.value) : null
  const e = effectiveEnd.value ? toStr(effectiveEnd.value) : null
  const inRange = !!(s && e && d > s && d < e)
  return {
    isStart:  d === s,
    isEnd:    !!e && d === e,
    inRange,
    isToday:  d === toStr(new Date()),
    single:   d === s && !!e && d === e,
  }
}

// ── Interaction ───────────────────────────────────────────────────
function handleClick(date: Date) {
  if (!selecting.value || !startDate.value) {
    startDate.value = date; endDate.value = null; selecting.value = true
  } else if (toStr(date) < toStr(startDate.value)) {
    startDate.value = date
  } else {
    endDate.value = date; selecting.value = false
  }
}

function prevMonth() {
  if (leftMonth.value === 0) { leftMonth.value = 11; leftYear.value-- }
  else leftMonth.value--
}

function nextMonth() {
  if (leftMonth.value === 11) { leftMonth.value = 0; leftYear.value++ }
  else leftMonth.value++
}

// ── Display ───────────────────────────────────────────────────────
function monthLabel(year: number, month: number) {
  const l = localeCode.value
  return new Date(year, month, 1).toLocaleDateString(l, { month: 'long', year: 'numeric' })
}

const weekDays = computed(() => {
  const l = localeCode.value
  return Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(l, { weekday: 'short' }).format(new Date(2024, 0, 7 + i)).slice(0, 2),
  )
})

const rangeText = computed(() => {
  const l = localeCode.value
  const fmt = (d: Date) => d.toLocaleDateString(l, { day: 'numeric', month: 'short', year: 'numeric' })
  if (startDate.value && endDate.value) return `${fmt(startDate.value)} – ${fmt(endDate.value)}`
  if (startDate.value) return fmt(startDate.value)
  return ''
})

const customBtnLabel = computed(() => {
  if (props.modelValue === 'custom' && props.customRange?.from && props.customRange?.to) {
    const l = localeCode.value
    const fmt = (s: string) => new Date(s + 'T00:00:00').toLocaleDateString(l, { day: 'numeric', month: 'short' })
    return `${fmt(props.customRange.from)} – ${fmt(props.customRange.to)}`
  }
  return t('dashboard.filter.custom')
})

function applyRange() {
  if (!startDate.value || !endDate.value) return
  emit('update:customRange', { from: toStr(startDate.value), to: toStr(endDate.value) })
  emit('update:modelValue', 'custom')
  showPicker.value = false
}

function selectPreset(value: DateRange) {
  emit('update:modelValue', value)
  showPicker.value = false
}
</script>

<template>
  <div ref="pickerRef" class="relative">
    <!-- Segmented control -->
    <div class="inline-flex items-center gap-0.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] p-1">
      <button
        v-for="opt in presets"
        :key="opt.value"
        class="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150"
        :class="modelValue === opt.value
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'"
        @click="selectPreset(opt.value)"
      >
        {{ t(opt.labelKey) }}
      </button>
      <button
        class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150"
        :class="modelValue === 'custom'
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'"
        @click="showPicker = !showPicker"
      >
        <CalendarDays class="size-3 shrink-0" />
        {{ customBtnLabel }}
      </button>
    </div>

    <!-- Calendar dropdown -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showPicker"
        class="absolute right-0 top-full z-50 mt-2 rounded-xl border border-border/50 bg-popover p-4 shadow-xl"
        @mouseleave="hovered = null"
      >
        <!-- Month navigation header -->
        <div class="mb-3 flex items-center justify-between gap-4">
          <button
            class="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="prevMonth"
          >
            <ChevronLeft class="size-4" />
          </button>
          <div class="flex flex-1 justify-around">
            <span class="text-sm font-semibold text-foreground">{{ monthLabel(leftYear, leftMonth) }}</span>
            <span class="text-sm font-semibold text-foreground">{{ monthLabel(rightYear, rightMonth) }}</span>
          </div>
          <button
            class="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="nextMonth"
          >
            <ChevronRight class="size-4" />
          </button>
        </div>

        <!-- Two calendars side by side -->
        <div class="flex gap-6">
          <div v-for="(grid, gi) in [leftGrid, rightGrid]" :key="gi" class="w-56">
            <!-- Weekday headers -->
            <div class="mb-1 grid grid-cols-7 text-center">
              <span
                v-for="wd in weekDays"
                :key="wd"
                class="py-1 text-[11px] font-medium uppercase text-muted-foreground"
              >{{ wd }}</span>
            </div>
            <!-- Day grid -->
            <div class="grid grid-cols-7">
              <div
                v-for="cell in grid"
                :key="toStr(cell.date)"
                class="relative flex h-8 items-center justify-center"
                @mouseenter="hovered = cell.date"
              >
                <!-- Range fill -->
                <div
                  v-if="dayState(cell.date).inRange"
                  class="absolute inset-y-0.5 inset-x-0 bg-primary/10"
                />
                <div
                  v-else-if="dayState(cell.date).isStart && dayState(cell.date).isEnd === false && effectiveEnd"
                  class="absolute inset-y-0.5 left-1/2 right-0 bg-primary/10"
                />
                <div
                  v-else-if="dayState(cell.date).isEnd && !dayState(cell.date).single"
                  class="absolute inset-y-0.5 left-0 right-1/2 bg-primary/10"
                />

                <!-- Day button -->
                <button
                  class="relative z-10 flex size-7 items-center justify-center rounded-full text-xs transition-colors"
                  :class="[
                    dayState(cell.date).isStart || dayState(cell.date).isEnd
                      ? 'bg-primary font-semibold text-primary-foreground'
                      : dayState(cell.date).isToday
                        ? 'font-bold text-primary ring-1 ring-primary/40'
                        : cell.current
                          ? 'text-foreground hover:bg-accent'
                          : 'text-muted-foreground/40 hover:bg-accent',
                  ]"
                  @click="handleClick(cell.date)"
                >
                  {{ cell.date.getDate() }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-4 flex items-center justify-between gap-4 border-t border-border/50 pt-3">
          <span class="text-xs text-muted-foreground">
            {{ rangeText || t('dashboard.filter.selectRange') }}
          </span>
          <button
            class="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
            :disabled="!startDate || !endDate"
            @click="applyRange"
          >
            {{ t('dashboard.filter.apply') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

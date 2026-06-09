<script setup lang="ts" generic="TData extends object, TValue">
import { h } from 'vue'
import type {
  ColumnDef,
  SortingState,
  PaginationState,
  RowSelectionState,
} from '@tanstack/vue-table'
import { useVueTable, getCoreRowModel, FlexRender } from '@tanstack/vue-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Users } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    loading?: boolean
    pageCount?: number
    enableRowSelection?: boolean
  }>(),
  {
    loading: false,
    pageCount: -1,
    enableRowSelection: false,
  },
)

const emit = defineEmits<{
  'update:pagination': [{ pageIndex: number; pageSize: number }]
  'update:sorting': [SortingState]
  'update:globalFilter': [string]
  rowSelectionChange: [selectedRows: TData[]]
}>()

const { t } = useI18n()

const sorting = ref<SortingState>([])
const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })
const rowSelection = ref<RowSelectionState>({})
const searchInput = ref('')

watchDebounced(searchInput, (v) => emit('update:globalFilter', v), { debounce: 350 })

const resolvedColumns = computed<ColumnDef<TData, TValue>[]>(() => {
  if (!props.enableRowSelection) return props.columns

  const selectionCol: ColumnDef<TData, TValue> = {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        'onUpdate:checked': (val: boolean) => table.toggleAllPageRowsSelected(val),
        'aria-label': 'Tümünü seç',
        class: 'translate-y-px',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (val: boolean) => row.toggleSelected(val),
        'aria-label': 'Satırı seç',
        class: 'translate-y-px',
      }),
    enableSorting: false,
    size: 40,
  }

  return [selectionCol, ...props.columns]
})

const table = useVueTable<TData>({
  get data() { return props.data },
  get columns() { return resolvedColumns.value },
  getCoreRowModel: getCoreRowModel(),
  manualSorting: true,
  manualPagination: true,
  manualFiltering: true,
  get pageCount() { return props.pageCount },
  state: {
    get sorting() { return sorting.value },
    get pagination() { return pagination.value },
    get rowSelection() { return rowSelection.value },
  },
  get enableRowSelection() { return props.enableRowSelection },
  onSortingChange(updater) {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    emit('update:sorting', sorting.value)
  },
  onPaginationChange(updater) {
    pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater
    emit('update:pagination', {
      pageIndex: pagination.value.pageIndex,
      pageSize: pagination.value.pageSize,
    })
  },
  onRowSelectionChange(updater) {
    rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    const selected = table.getSelectedRowModel().rows.map((r) => r.original)
    emit('rowSelectionChange', selected)
  },
})

const SKELETON_ROWS = 6

const currentPage = computed(() => pagination.value.pageIndex + 1)
const totalPages = computed(() => (props.pageCount > 0 ? props.pageCount : 1))

function prevPage() {
  if (pagination.value.pageIndex > 0) {
    pagination.value = { ...pagination.value, pageIndex: pagination.value.pageIndex - 1 }
    emit('update:pagination', { pageIndex: pagination.value.pageIndex, pageSize: pagination.value.pageSize })
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    pagination.value = { ...pagination.value, pageIndex: pagination.value.pageIndex + 1 }
    emit('update:pagination', { pageIndex: pagination.value.pageIndex, pageSize: pagination.value.pageSize })
  }
}
</script>

<template>
  <div class="rounded-xl bg-muted/60 dark:bg-muted overflow-hidden">

    <!-- Top bar: arama + ek araçlar (slot) -->
    <div class="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-border/40">
      <div class="relative">
        <Search class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchInput"
          type="text"
          :placeholder="t('common.search')"
          class="h-8 w-48 rounded-lg border border-border/50 bg-background/70 pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 outline-none transition-all focus:w-60 focus:ring-1 focus:ring-ring"
        />
      </div>
      <slot name="toolbar" />
    </div>

    <!-- Tablo -->
    <div class="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="border-border/40 hover:bg-transparent bg-black/[0.02] dark:bg-white/[0.02]"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="h-10 px-4 text-muted-foreground"
              :style="header.column.columnDef.size ? { width: `${header.column.columnDef.size}px` } : {}"
            >
              <template v-if="!header.isPlaceholder">
                <button
                  v-if="header.column.getCanSort()"
                  class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors"
                  @click="header.column.toggleSorting()"
                >
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                  <ArrowUp v-if="header.column.getIsSorted() === 'asc'" class="size-3" />
                  <ArrowDown v-else-if="header.column.getIsSorted() === 'desc'" class="size-3" />
                  <ArrowUpDown v-else class="size-3 opacity-40" />
                </button>
                <span
                  v-else
                  class="text-xs font-semibold uppercase tracking-wider"
                >
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                </span>
              </template>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <!-- Loading skeleton -->
          <template v-if="loading">
            <TableRow
              v-for="i in SKELETON_ROWS"
              :key="i"
              class="border-border/30"
            >
              <TableCell v-for="col in resolvedColumns" :key="String(col.id ?? '')" class="px-4 py-3.5">
                <Skeleton class="h-4 w-full rounded-md" />
              </TableCell>
            </TableRow>
          </template>

          <!-- Veri satırları -->
          <template v-else-if="table.getRowModel().rows.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : ''"
              class="border-border/30 hover:bg-accent/40 transition-colors"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="px-4 py-3.5"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <!-- Boş durum -->
          <template v-else>
            <TableRow class="hover:bg-transparent border-0">
              <TableCell :colspan="resolvedColumns.length" class="py-16">
                <div class="flex flex-col items-center gap-3 text-muted-foreground">
                  <Users class="size-10 opacity-25" />
                  <p class="text-sm">Kayıt bulunamadı</p>
                </div>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between border-t border-border/40 px-4 py-3">
      <span class="text-xs text-muted-foreground">
        Sayfa <span class="font-medium text-foreground">{{ currentPage }}</span> / {{ totalPages }}
      </span>
      <div class="flex items-center gap-1">
        <button
          class="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          :disabled="currentPage <= 1"
          @click="prevPage"
        >
          <ChevronLeft class="size-4" />
        </button>

        <!-- Sayfa noktaları (max 7) -->
        <div class="flex items-center gap-0.5 px-1">
          <div
            v-for="p in Math.min(totalPages, 7)"
            :key="p"
            class="rounded-full transition-all"
            :class="p === currentPage
              ? 'size-1.5 bg-foreground'
              : 'size-1 bg-muted-foreground/30'"
          />
        </div>

        <button
          class="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          :disabled="currentPage >= totalPages"
          @click="nextPage"
        >
          <ChevronRight class="size-4" />
        </button>
      </div>
    </div>

  </div>
</template>

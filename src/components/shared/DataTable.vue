<script setup lang="ts" generic="TData extends object, TValue">
import { h } from 'vue'
import type { ColumnDef, SortingState, PaginationState, RowSelectionState } from '@tanstack/vue-table'
import { useVueTable, getCoreRowModel, FlexRender } from '@tanstack/vue-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-vue-next'

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

const sorting = ref<SortingState>([])
const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })
const rowSelection = ref<RowSelectionState>({})
const searchInput = ref('')

// Debounce — global filter emit'i arama biterken tetiklenir
watchDebounced(
  searchInput,
  (v) => emit('update:globalFilter', v),
  { debounce: 350 },
)

// Seçim kolonu — enableRowSelection açıksa en başa eklenir
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
  get data() {
    return props.data
  },
  get columns() {
    return resolvedColumns.value
  },
  getCoreRowModel: getCoreRowModel(),
  manualSorting: true,
  manualPagination: true,
  manualFiltering: true,
  get pageCount() {
    return props.pageCount
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    },
    get rowSelection() {
      return rowSelection.value
    },
  },
  get enableRowSelection() {
    return props.enableRowSelection
  },
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

const SKELETON_ROWS = 5

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
  <div class="space-y-3">
    <!-- Arama girişi -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        v-model="searchInput"
        type="text"
        placeholder="Ara..."
        class="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:max-w-xs"
      />
    </div>

    <!-- Tablo -->
    <div class="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :style="header.column.columnDef.size ? { width: `${header.column.columnDef.size}px` } : {}"
            >
              <template v-if="!header.isPlaceholder">
                <button
                  v-if="header.column.getCanSort()"
                  class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide hover:text-foreground"
                  @click="header.column.toggleSorting()"
                >
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <ArrowUp v-if="header.column.getIsSorted() === 'asc'" class="size-3.5" />
                  <ArrowDown v-else-if="header.column.getIsSorted() === 'desc'" class="size-3.5" />
                  <ArrowUpDown v-else class="size-3.5 opacity-50" />
                </button>
                <FlexRender
                  v-else
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </template>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <!-- Loading skeleton -->
          <template v-if="loading">
            <TableRow v-for="i in SKELETON_ROWS" :key="i">
              <TableCell
                v-for="col in resolvedColumns"
                :key="String(col.id ?? '')"
              >
                <Skeleton class="h-4 w-full" />
              </TableCell>
            </TableRow>
          </template>

          <!-- Veri satırları -->
          <template v-else-if="table.getRowModel().rows.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : ''"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <!-- Boş durum -->
          <template v-else>
            <TableRow>
              <TableCell :colspan="resolvedColumns.length" class="py-12 text-center text-sm text-muted-foreground">
                Kayıt bulunamadı
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Sayfalama -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <span>Sayfa {{ currentPage }} / {{ totalPages }}</span>
      <div class="flex items-center gap-1">
        <button
          class="flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
          :disabled="currentPage <= 1"
          @click="prevPage"
        >
          <ChevronLeft class="size-4" />
        </button>
        <button
          class="flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
          :disabled="currentPage >= totalPages"
          @click="nextPage"
        >
          <ChevronRight class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>

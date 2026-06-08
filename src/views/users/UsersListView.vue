<script setup lang="ts">
import { h } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ColumnDef, SortingState } from '@tanstack/vue-table'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { useConfirm } from '@/composables/useConfirm'
import { toast } from 'vue-sonner'
import type { User, UserRole, UserStatus, UserListParams } from '@/types/api'
import { Eye, Trash2 } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const queryClient = useQueryClient()
const { confirm } = useConfirm()

// ── Sorgu parametreleri ────────────────────────────────────────────────────

const params = reactive<UserListParams>({
  page: 1,
  pageSize: 10,
  search: undefined,
  role: undefined,
  status: undefined,
  sortBy: undefined,
  sortDir: 'asc',
})

const filterRole = ref<UserRole | 'all'>('all')
const filterStatus = ref<UserStatus | 'all'>('all')

watch(filterRole, (v) => {
  params.role = v === 'all' ? undefined : v
  params.page = 1
})

watch(filterStatus, (v) => {
  params.status = v === 'all' ? undefined : v
  params.page = 1
})

// ── Seçili satırlar ────────────────────────────────────────────────────────

const selectedRows = ref<User[]>([])

// ── Vue Query ──────────────────────────────────────────────────────────────

const queryKey = computed(() => ['users', 'list', { ...params }])

const { data, isPending } = useQuery({
  queryKey,
  queryFn: () => api.users.list({ ...params }),
})

const pageCount = computed(() =>
  data.value ? Math.ceil(data.value.total / params.pageSize) : -1,
)

// ── Mutasyonlar ────────────────────────────────────────────────────────────

const removeMutation = useMutation({
  mutationFn: (id: string) => api.users.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
    toast.success(t('users.detail.profile.saved'))
  },
})

const bulkRemoveMutation = useMutation({
  mutationFn: (ids: string[]) => api.users.bulkRemove(ids),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
    selectedRows.value = []
    toast.success(t('users.list.bulkRemove'))
  },
})

const bulkDeactivateMutation = useMutation({
  mutationFn: (ids: string[]) => api.users.bulkDeactivate(ids),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
    selectedRows.value = []
    toast.success(t('users.list.bulkDeactivate'))
  },
})

// ── Aksiyon işleyiciler ────────────────────────────────────────────────────

async function handleDelete(user: User) {
  const ok = await confirm({
    title: t('users.list.confirmRemoveTitle'),
    description: t('users.list.confirmRemoveDesc'),
    confirmLabel: t('common.delete'),
    variant: 'destructive',
  })
  if (ok) removeMutation.mutate(user.id)
}

async function handleBulkRemove() {
  const ok = await confirm({
    title: t('users.list.confirmBulkRemoveTitle', { count: selectedRows.value.length }),
    description: t('users.list.confirmRemoveDesc'),
    confirmLabel: t('common.delete'),
    variant: 'destructive',
  })
  if (ok) bulkRemoveMutation.mutate(selectedRows.value.map((u) => u.id))
}

async function handleBulkDeactivate() {
  const ok = await confirm({
    title: t('users.list.confirmDeactivateTitle', { count: selectedRows.value.length }),
    confirmLabel: t('common.confirm'),
  })
  if (ok) bulkDeactivateMutation.mutate(selectedRows.value.map((u) => u.id))
}

// ── Tablo emit işleyiciler ─────────────────────────────────────────────────

function onPagination({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) {
  params.page = pageIndex + 1
  params.pageSize = pageSize
}

function onSorting(sorting: SortingState) {
  if (sorting.length > 0) {
    params.sortBy = sorting[0].id as keyof User
    params.sortDir = sorting[0].desc ? 'desc' : 'asc'
  } else {
    params.sortBy = undefined
  }
  params.page = 1
}

function onGlobalFilter(search: string) {
  params.search = search || undefined
  params.page = 1
}

// ── Yardımcılar ────────────────────────────────────────────────────────────

const statusClass: Record<UserStatus, string> = {
  active:
    'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  inactive:
    'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
  pending:
    'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
}

const roleClass: Record<UserRole, string> = {
  admin:
    'bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800',
  editor:
    'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  viewer:
    'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
}

// ── Kolon tanımları ────────────────────────────────────────────────────────

const columns = computed<ColumnDef<User, unknown>[]>(() => [
  {
    accessorKey: 'name',
    header: () => t('users.columns.name'),
    enableSorting: true,
    cell: ({ row }) =>
      h('div', { class: 'flex flex-col gap-0.5' }, [
        h('span', { class: 'font-medium text-foreground' }, row.original.name),
        h('span', { class: 'text-xs text-muted-foreground' }, row.original.email),
      ]),
  },
  {
    accessorKey: 'role',
    header: () => t('users.columns.role'),
    enableSorting: true,
    cell: ({ row }) =>
      h(
        'span',
        {
          class: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${roleClass[row.original.role]}`,
        },
        t(`users.roles.${row.original.role}`),
      ),
  },
  {
    accessorKey: 'status',
    header: () => t('users.columns.status'),
    enableSorting: true,
    cell: ({ row }) =>
      h(
        'span',
        {
          class: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[row.original.status]}`,
        },
        t(`users.statuses.${row.original.status}`),
      ),
  },
  {
    accessorKey: 'createdAt',
    header: () => t('users.columns.createdAt'),
    enableSorting: true,
    cell: ({ row }) =>
      h('span', { class: 'text-sm text-muted-foreground' }, formatDate(row.original.createdAt)),
  },
  {
    id: 'actions',
    header: () => null,
    enableSorting: false,
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-1' }, [
        h(
          'button',
          {
            class:
              'flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground',
            title: t('users.actions.view'),
            onClick: () => router.push(`/users/${row.original.id}`),
          },
          [h(Eye, { class: 'size-4' })],
        ),
        h(
          'button',
          {
            class:
              'flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
            title: t('users.actions.delete'),
            onClick: () => handleDelete(row.original),
          },
          [h(Trash2, { class: 'size-4' })],
        ),
      ]),
  },
])
</script>

<template>
  <div class="space-y-5">
    <!-- Başlık + Filtreler -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-semibold text-foreground">{{ $t('users.list.title') }}</h1>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Rol filtresi -->
        <Select v-model="filterRole">
          <SelectTrigger class="h-8 w-36 text-xs">
            <SelectValue :placeholder="$t('users.list.filterRole')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{{ $t('common.all') }}</SelectItem>
            <SelectItem value="admin">{{ $t('users.roles.admin') }}</SelectItem>
            <SelectItem value="editor">{{ $t('users.roles.editor') }}</SelectItem>
            <SelectItem value="viewer">{{ $t('users.roles.viewer') }}</SelectItem>
          </SelectContent>
        </Select>

        <!-- Durum filtresi -->
        <Select v-model="filterStatus">
          <SelectTrigger class="h-8 w-36 text-xs">
            <SelectValue :placeholder="$t('users.list.filterStatus')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{{ $t('common.all') }}</SelectItem>
            <SelectItem value="active">{{ $t('users.statuses.active') }}</SelectItem>
            <SelectItem value="inactive">{{ $t('users.statuses.inactive') }}</SelectItem>
            <SelectItem value="pending">{{ $t('users.statuses.pending') }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Bulk action çubuğu -->
    <Transition name="fade">
      <div
        v-if="selectedRows.length > 0"
        class="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-2.5"
      >
        <span class="text-sm font-medium text-foreground">
          {{ $t('users.list.selected', { count: selectedRows.length }) }}
        </span>
        <div class="ml-auto flex gap-2">
          <button
            class="rounded-md border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-accent"
            :disabled="bulkDeactivateMutation.isPending.value"
            @click="handleBulkDeactivate"
          >
            {{ $t('users.list.bulkDeactivate') }}
          </button>
          <button
            class="rounded-md bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
            :disabled="bulkRemoveMutation.isPending.value"
            @click="handleBulkRemove"
          >
            {{ $t('users.list.bulkRemove') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Tablo -->
    <DataTable
      :columns="columns"
      :data="data?.data ?? []"
      :loading="isPending"
      :page-count="pageCount"
      enable-row-selection
      @update:pagination="onPagination"
      @update:sorting="onSorting"
      @update:global-filter="onGlobalFilter"
      @row-selection-change="(rows) => (selectedRows = rows)"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

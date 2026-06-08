import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { SortingState } from '@tanstack/vue-table'
import { api } from '@/lib/api'
import { toast } from 'vue-sonner'
import type { User, UserRole, UserStatus, UserListParams } from '@/types/api'

export function useUsersList() {
  const { t } = useI18n()
  const queryClient = useQueryClient()
  const { confirm } = useConfirm()

  // ── Sorgu parametreleri ──────────────────────────────────────────────────

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

  const selectedRows = ref<User[]>([])

  // ── Vue Query ────────────────────────────────────────────────────────────

  const queryKey = computed(() => ['users', 'list', { ...params }])

  const { data, isPending } = useQuery({
    queryKey,
    queryFn: () => api.users.list({ ...params }),
  })

  const pageCount = computed(() =>
    data.value ? Math.ceil(data.value.total / params.pageSize) : -1,
  )

  // ── Mutasyonlar ──────────────────────────────────────────────────────────

  const removeMutation = useMutation({
    mutationFn: (id: string) => api.users.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
      toast.success(t('users.list.deleted'))
    },
    onError: () => toast.error(t('common.error')),
  })

  const bulkRemoveMutation = useMutation({
    mutationFn: (ids: string[]) => api.users.bulkRemove(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
      selectedRows.value = []
      toast.success(t('users.list.bulkRemoved'))
    },
    onError: () => toast.error(t('common.error')),
  })

  const bulkDeactivateMutation = useMutation({
    mutationFn: (ids: string[]) => api.users.bulkDeactivate(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
      selectedRows.value = []
      toast.success(t('users.list.bulkDeactivated'))
    },
    onError: () => toast.error(t('common.error')),
  })

  // ── Aksiyon işleyiciler ──────────────────────────────────────────────────

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

  // ── Tablo emit işleyiciler ───────────────────────────────────────────────

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

  return {
    filterRole,
    filterStatus,
    selectedRows,
    data,
    isPending,
    pageCount,
    bulkRemoveMutation,
    bulkDeactivateMutation,
    handleDelete,
    handleBulkRemove,
    handleBulkDeactivate,
    onPagination,
    onSorting,
    onGlobalFilter,
  }
}

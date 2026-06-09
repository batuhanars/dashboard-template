<script setup lang="ts">
import { useUsersColumns } from './components/useUsersColumns'
import UsersFilterBar from './components/UsersFilterBar.vue'
import UsersBulkActionBar from './components/UsersBulkActionBar.vue'

const router = useRouter()

const {
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
} = useUsersList()

const { columns } = useUsersColumns(
  (user) => router.push(`/users/${user.id}`),
  handleDelete,
)
</script>

<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-foreground text-2xl font-semibold">{{ $t('users.list.title') }}</h1>
    </div>

    <Transition name="fade">
      <UsersBulkActionBar
        v-if="selectedRows.length > 0"
        :count="selectedRows.length"
        :bulk-deactivate-pending="bulkDeactivateMutation.isPending.value"
        :bulk-remove-pending="bulkRemoveMutation.isPending.value"
        @bulk-deactivate="handleBulkDeactivate"
        @bulk-remove="handleBulkRemove"
      />
    </Transition>

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
    >
      <template #toolbar>
        <UsersFilterBar
          :filter-role="filterRole"
          :filter-status="filterStatus"
          @update:filter-role="(v) => (filterRole = v)"
          @update:filter-status="(v) => (filterStatus = v)"
        />
      </template>
    </DataTable>
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

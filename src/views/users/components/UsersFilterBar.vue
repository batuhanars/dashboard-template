<script setup lang="ts">
import type { UserRole, UserStatus } from '@/types/api'

defineProps<{
  filterRole: UserRole | 'all'
  filterStatus: UserStatus | 'all'
}>()

const emit = defineEmits<{
  'update:filterRole': [value: UserRole | 'all']
  'update:filterStatus': [value: UserStatus | 'all']
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Select
      :model-value="filterRole"
      @update:model-value="(v) => emit('update:filterRole', v as UserRole | 'all')"
    >
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

    <Select
      :model-value="filterStatus"
      @update:model-value="(v) => emit('update:filterStatus', v as UserStatus | 'all')"
    >
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
</template>

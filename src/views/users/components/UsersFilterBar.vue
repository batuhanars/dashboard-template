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
    <div class="bg-border/60 h-5 w-px hidden sm:block" />

    <div class="flex items-center gap-1.5">
      <span class="text-muted-foreground text-xs font-medium">{{ $t('users.columns.role') }}</span>
      <Select
        :model-value="filterRole"
        @update:model-value="(v) => emit('update:filterRole', v as UserRole | 'all')"
      >
        <SelectTrigger class="h-8 w-32 text-xs">
          <SelectValue :placeholder="$t('common.all')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{{ $t('common.all') }}</SelectItem>
          <SelectItem value="admin">{{ $t('users.roles.admin') }}</SelectItem>
          <SelectItem value="editor">{{ $t('users.roles.editor') }}</SelectItem>
          <SelectItem value="viewer">{{ $t('users.roles.viewer') }}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="flex items-center gap-1.5">
      <span class="text-muted-foreground text-xs font-medium">{{ $t('users.columns.status') }}</span>
      <Select
        :model-value="filterStatus"
        @update:model-value="(v) => emit('update:filterStatus', v as UserStatus | 'all')"
      >
        <SelectTrigger class="h-8 w-32 text-xs">
          <SelectValue :placeholder="$t('common.all')" />
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
</template>

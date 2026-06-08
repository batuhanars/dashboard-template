<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'
import type { User, UserRole } from '@/types/api'

const props = defineProps<{ user: User }>()

const { t } = useI18n()

const roleDescKey: Record<UserRole, string> = {
  admin: 'users.detail.permissions.adminDesc',
  editor: 'users.detail.permissions.editorDesc',
  viewer: 'users.detail.permissions.viewerDesc',
}

type PermissionEntry = { key: string; allowed: boolean }

const permissionsByRole: Record<UserRole, PermissionEntry[]> = {
  admin: [
    { key: 'users.detail.permissions.cap.userManagement', allowed: true },
    { key: 'users.detail.permissions.cap.systemSettings', allowed: true },
    { key: 'users.detail.permissions.cap.contentManagement', allowed: true },
    { key: 'users.detail.permissions.cap.reports', allowed: true },
  ],
  editor: [
    { key: 'users.detail.permissions.cap.contentCreation', allowed: true },
    { key: 'users.detail.permissions.cap.mediaUpload', allowed: true },
    { key: 'users.detail.permissions.cap.userManagement', allowed: false },
    { key: 'users.detail.permissions.cap.systemSettings', allowed: false },
  ],
  viewer: [
    { key: 'users.detail.permissions.cap.contentView', allowed: true },
    { key: 'users.detail.permissions.cap.reportsView', allowed: true },
    { key: 'users.detail.permissions.cap.editCreate', allowed: false },
    { key: 'users.detail.permissions.cap.userManagement', allowed: false },
  ],
}

const permissions = computed(() => permissionsByRole[props.user.role])
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $t('users.detail.permissions.title') }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="flex items-center gap-3 rounded-lg border border-border p-4">
        <ShieldCheck class="size-8 shrink-0 text-primary" />
        <div>
          <p class="font-medium text-foreground">{{ $t(`users.roles.${user.role}`) }}</p>
          <p class="text-sm text-muted-foreground">{{ $t(roleDescKey[user.role]) }}</p>
        </div>
      </div>

      <div class="rounded-lg border border-border p-4">
        <p class="mb-3 text-sm font-medium text-foreground">
          {{ $t('users.detail.permissions.role') }}
        </p>
        <div class="space-y-2 text-sm">
          <p v-for="perm in permissions" :key="perm.key" class="flex items-center gap-2">
            <span
              :class="
                perm.allowed
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-500 dark:text-rose-400'
              "
            >
              {{ perm.allowed ? '✓' : '✗' }}
            </span>
            <span class="text-muted-foreground">{{ t(perm.key) }}</span>
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

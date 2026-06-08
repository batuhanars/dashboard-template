<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/format'

const props = defineProps<{ userId: string }>()

const { data: activities, isPending } = useQuery({
  queryKey: computed(() => ['users', 'activities', props.userId]),
  queryFn: () => api.users.activities(props.userId),
})

const activityTypeIcon: Record<string, string> = {
  login: '🔐',
  update: '✏️',
  create: '➕',
  delete: '🗑️',
  comment: '💬',
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $t('users.detail.activity.title') }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="isPending" class="space-y-3">
        <Skeleton v-for="i in 5" :key="i" class="h-12 rounded-lg" />
      </div>
      <div
        v-else-if="!activities?.length"
        class="py-10 text-center text-sm text-muted-foreground"
      >
        {{ $t('users.detail.activity.empty') }}
      </div>
      <ul v-else class="space-y-2">
        <li
          v-for="act in activities"
          :key="act.id"
          class="flex items-start gap-3 rounded-lg border border-border p-3"
        >
          <span class="text-base leading-none">{{ activityTypeIcon[act.type] ?? '📋' }}</span>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-foreground">{{ act.description }}</p>
            <p class="mt-0.5 text-xs text-muted-foreground">{{ formatDate(act.createdAt) }}</p>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>

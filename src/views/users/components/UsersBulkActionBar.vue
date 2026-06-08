<script setup lang="ts">
defineProps<{
  count: number
  bulkDeactivatePending: boolean
  bulkRemovePending: boolean
}>()

const emit = defineEmits<{
  'bulk-deactivate': []
  'bulk-remove': []
}>()
</script>

<template>
  <div class="border-border bg-muted/50 flex items-center gap-3 rounded-lg border px-4 py-2.5">
    <span class="text-foreground text-sm font-medium">
      {{ $t('users.list.selected', { count }) }}
    </span>
    <div class="ml-auto flex gap-2">
      <button
        class="border-border bg-background hover:bg-accent rounded-md border px-3 py-1 text-xs font-medium"
        :disabled="bulkDeactivatePending"
        @click="emit('bulk-deactivate')"
      >
        {{ $t('users.list.bulkDeactivate') }}
      </button>
      <button
        class="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-3 py-1 text-xs font-medium"
        :disabled="bulkRemovePending"
        @click="emit('bulk-remove')"
      >
        {{ $t('users.list.bulkRemove') }}
      </button>
    </div>
  </div>
</template>

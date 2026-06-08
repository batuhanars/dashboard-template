<script setup lang="ts">
import { confirmState } from '@/composables/useConfirm'

function handleConfirm() {
  confirmState.resolve?.(true)
  confirmState.open = false
}

function handleCancel() {
  confirmState.resolve?.(false)
  confirmState.open = false
}
</script>

<template>
  <AlertDialog
    :open="confirmState.open"
    @update:open="(v) => { if (!v) handleCancel() }"
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ confirmState.options.title }}</AlertDialogTitle>
        <AlertDialogDescription v-if="confirmState.options.description">
          {{ confirmState.options.description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancel">
          {{ confirmState.options.cancelLabel ?? 'İptal' }}
        </AlertDialogCancel>
        <AlertDialogAction
          :class="
            confirmState.options.variant === 'destructive'
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : ''
          "
          @click="handleConfirm"
        >
          {{ confirmState.options.confirmLabel ?? 'Onayla' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

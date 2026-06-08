<script setup lang="ts">
import { toast } from 'vue-sonner'

const { t } = useI18n()
const { confirm } = useConfirm()

async function handleDeleteAccount() {
  const ok = await confirm({
    title: t('settings.danger.confirmTitle'),
    description: t('settings.danger.confirmDesc'),
    confirmLabel: t('common.delete'),
    variant: 'destructive',
  })
  if (ok) {
    toast.success(t('settings.danger.deleteRequested'))
  }
}
</script>

<template>
  <Card class="border-destructive/40">
    <CardHeader>
      <CardTitle class="text-destructive">{{ $t('settings.danger.title') }}</CardTitle>
      <CardDescription>{{ $t('settings.danger.subtitle') }}</CardDescription>
    </CardHeader>
    <CardContent>
      <div
        class="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4"
      >
        <div>
          <p class="font-medium text-foreground">{{ $t('settings.danger.deleteAccount') }}</p>
          <p class="text-sm text-muted-foreground">{{ $t('settings.danger.deleteDesc') }}</p>
        </div>
        <Button variant="destructive" @click="handleDeleteAccount">
          {{ $t('settings.danger.deleteAccount') }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

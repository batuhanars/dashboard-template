<script setup lang="ts">
const notifications = reactive({ email: true, push: false, marketing: false })
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $t('settings.notifications.title') }}</CardTitle>
      <CardDescription>{{ $t('settings.notifications.subtitle') }}</CardDescription>
    </CardHeader>
    <CardContent class="divide-border space-y-0 divide-y">
      <div class="flex items-center justify-between py-4">
        <div>
          <p class="font-medium text-foreground">{{ $t('settings.notifications.email') }}</p>
          <p class="text-sm text-muted-foreground">{{ $t('settings.notifications.emailDesc') }}</p>
        </div>
        <Switch v-model:checked="notifications.email" />
      </div>
      <div class="flex items-center justify-between py-4">
        <div>
          <p class="font-medium text-foreground">{{ $t('settings.notifications.push') }}</p>
          <p class="text-sm text-muted-foreground">{{ $t('settings.notifications.pushDesc') }}</p>
        </div>
        <Switch v-model:checked="notifications.push" />
      </div>
      <div class="flex items-center justify-between py-4">
        <div>
          <p class="font-medium text-foreground">{{ $t('settings.notifications.marketing') }}</p>
          <p class="text-sm text-muted-foreground">
            {{ $t('settings.notifications.marketingDesc') }}
          </p>
        </div>
        <Switch v-model:checked="notifications.marketing" />
      </div>
    </CardContent>
  </Card>
</template>

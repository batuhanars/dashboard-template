<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const { isDark, toggle: toggleTheme } = useTheme()
const { locale, setLocale, available } = useLocale()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $t('settings.appearance.title') }}</CardTitle>
      <CardDescription>{{ $t('settings.appearance.subtitle') }}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Tema -->
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium text-foreground">{{ $t('settings.appearance.theme') }}</p>
          <p class="text-sm text-muted-foreground">{{ $t('settings.appearance.themeDesc') }}</p>
        </div>
        <div class="flex items-center gap-2 rounded-lg border border-border p-1">
          <button
            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors"
            :class="
              !isDark
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="toggleTheme"
          >
            <Sun class="size-3.5" />
            {{ $t('theme.light') }}
          </button>
          <button
            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors"
            :class="
              isDark
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="toggleTheme"
          >
            <Moon class="size-3.5" />
            {{ $t('theme.dark') }}
          </button>
        </div>
      </div>

      <Separator />

      <!-- Dil -->
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium text-foreground">{{ $t('settings.appearance.locale') }}</p>
          <p class="text-sm text-muted-foreground">{{ $t('settings.appearance.localeDesc') }}</p>
        </div>
        <div class="flex gap-1.5 rounded-lg border border-border p-1">
          <button
            v-for="lang in available"
            :key="lang"
            class="rounded-md px-3 py-1.5 text-sm transition-colors"
            :class="
              locale === lang
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="setLocale(lang)"
          >
            {{ $t(`locale.${lang}`) }}
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

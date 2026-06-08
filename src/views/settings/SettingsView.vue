<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useConfirm } from '@/composables/useConfirm'
import { toast } from 'vue-sonner'
import { Sun, Moon } from 'lucide-vue-next'

const { t } = useI18n()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { isDark, toggle: toggleTheme } = useTheme()
const { locale, setLocale, available } = useLocale()
const { confirm } = useConfirm()

// ── Notification toggle'ları (yerel state) ─────────────────────────────────
const notifications = reactive({ email: true, push: false, marketing: false })

// ── Profil formu ───────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, 'En az 2 karakter'),
  email: z.string().email('Geçerli e-posta girin'),
})

const { handleSubmit: handleProfileSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(profileSchema),
  initialValues: { name: user.value?.name ?? '', email: user.value?.email ?? '' },
})

const onProfileSave = handleProfileSubmit(() => {
  // Mock — gerçek impl. M7'de veya backend bağlantısında yapılır
  toast.success(t('settings.profile.saved'))
})

// ── Danger Zone ────────────────────────────────────────────────────────────

async function handleDeleteAccount() {
  const ok = await confirm({
    title: t('settings.danger.confirmTitle'),
    description: t('settings.danger.confirmDesc'),
    confirmLabel: t('common.delete'),
    variant: 'destructive',
  })
  if (ok) {
    // Mock no-op
    toast.success('Hesap silme isteği alındı (mock)')
  }
}
</script>

<template>
  <div class="space-y-5">
    <h1 class="text-2xl font-semibold text-foreground">{{ $t('settings.title') }}</h1>

    <Tabs default-value="profile">
      <TabsList class="mb-4">
        <TabsTrigger value="profile">{{ $t('settings.tabs.profile') }}</TabsTrigger>
        <TabsTrigger value="appearance">{{ $t('settings.tabs.appearance') }}</TabsTrigger>
        <TabsTrigger value="notifications">{{ $t('settings.tabs.notifications') }}</TabsTrigger>
        <TabsTrigger value="danger">{{ $t('settings.tabs.danger') }}</TabsTrigger>
      </TabsList>

      <!-- Profil -->
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>{{ $t('settings.profile.title') }}</CardTitle>
            <CardDescription>{{ $t('settings.profile.subtitle') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <form class="max-w-md space-y-4" @submit="onProfileSave">
              <FormField
                name="name"
                :label="$t('settings.profile.name')"
                :placeholder="user?.name"
              />
              <FormField
                name="email"
                type="email"
                :label="$t('settings.profile.email')"
                :placeholder="user?.email"
              />
              <div class="pt-2">
                <Button type="submit" :disabled="isSubmitting">
                  {{ $t('settings.profile.save') }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Görünüm -->
      <TabsContent value="appearance">
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
                  :class="!isDark ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
                  @click="toggleTheme"
                >
                  <Sun class="size-3.5" />
                  {{ $t('theme.light') }}
                </button>
                <button
                  class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors"
                  :class="isDark ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
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
                  :class="locale === lang ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
                  @click="setLocale(lang)"
                >
                  {{ $t(`locale.${lang}`) }}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Bildirimler -->
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>{{ $t('settings.notifications.title') }}</CardTitle>
            <CardDescription>{{ $t('settings.notifications.subtitle') }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-0 divide-y divide-border">
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
                <p class="text-sm text-muted-foreground">{{ $t('settings.notifications.marketingDesc') }}</p>
              </div>
              <Switch v-model:checked="notifications.marketing" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Tehlikeli Bölge -->
      <TabsContent value="danger">
        <Card class="border-destructive/40">
          <CardHeader>
            <CardTitle class="text-destructive">{{ $t('settings.danger.title') }}</CardTitle>
            <CardDescription>{{ $t('settings.danger.subtitle') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4">
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
      </TabsContent>
    </Tabs>
  </div>
</template>

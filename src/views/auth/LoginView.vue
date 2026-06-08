<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { loginRequestSchema } from '@/types/api'
import { toast } from 'vue-sonner'
import { Sun, Moon } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { isDark, toggle: toggleTheme } = useTheme()
const { t } = useI18n()

const appName = import.meta.env.VITE_APP_NAME || 'Dashboard'

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginRequestSchema),
  initialValues: { email: '', password: '', rememberMe: false },
})

const { value: rememberMe } = useField<boolean>('rememberMe')

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err) {
    toast.error(err instanceof Error ? err.message : t('common.error'))
  }
})
</script>

<template>
  <div class="bg-background flex min-h-screen">
    <!-- Sol panel — dekoratif (lg ve üzeri) -->
    <div class="hidden flex-1 flex-col justify-between bg-zinc-900 p-10 lg:flex dark:bg-zinc-950">
      <div class="flex items-center gap-2">
        <div class="flex size-8 items-center justify-center rounded-lg bg-white">
          <span class="text-sm font-bold text-zinc-900">{{ appName.charAt(0) }}</span>
        </div>
        <span class="text-lg font-semibold text-white">{{ appName }}</span>
      </div>
      <blockquote class="space-y-2">
        <p class="text-lg text-zinc-200">"{{ $t('auth.login.marketingQuote') }}"</p>
        <footer class="text-sm text-zinc-400">{{ $t('auth.login.marketingFooter') }}</footer>
      </blockquote>
    </div>

    <!-- Sağ panel — form -->
    <div class="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <!-- Tema toggle (sağ üst) -->
      <div class="absolute top-4 right-4">
        <button
          class="border-border text-muted-foreground hover:bg-accent flex size-9 items-center justify-center rounded-md border"
          :title="t('theme.toggle')"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" class="size-4" />
          <Moon v-else class="size-4" />
        </button>
      </div>

      <div class="w-full max-w-sm space-y-6">
        <!-- Başlık -->
        <div class="space-y-1 text-center">
          <h1 class="text-foreground text-2xl font-semibold tracking-tight">
            {{ $t('auth.login.title') }}
          </h1>
          <p class="text-muted-foreground text-sm">{{ $t('auth.login.subtitle') }}</p>
        </div>

        <!-- Form -->
        <form class="space-y-4" @submit="onSubmit">
          <FormField
            name="email"
            type="email"
            :label="$t('auth.login.email')"
            placeholder="ornek@eposta.com"
          />
          <FormField
            name="password"
            type="password"
            :label="$t('auth.login.password')"
            placeholder="••••••••"
          />

          <!-- Beni hatırla + Şifremi unuttum -->
          <div class="flex items-center justify-between">
            <label class="text-foreground flex items-center gap-2 text-sm">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="border-input accent-primary size-4 rounded"
              />
              {{ $t('auth.login.rememberMe') }}
            </label>
            <RouterLink to="/forgot-password" class="text-primary text-sm hover:underline">
              {{ $t('auth.login.forgotPassword') }}
            </RouterLink>
          </div>

          <Button type="submit" class="w-full" :disabled="isSubmitting">
            {{ isSubmitting ? $t('common.loading') : $t('auth.login.submit') }}
          </Button>
        </form>

        <!-- Demo ipucu -->
        <p class="text-muted-foreground text-center text-xs">
          {{ $t('auth.login.demoHint') }}
        </p>
      </div>
    </div>
  </div>
</template>

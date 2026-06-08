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
  <div class="flex min-h-screen bg-background">
    <!-- Sol panel — dekoratif (lg ve üzeri) -->
    <div class="hidden flex-1 flex-col justify-between bg-zinc-900 p-10 dark:bg-zinc-950 lg:flex">
      <div class="flex items-center gap-2">
        <div class="flex size-8 items-center justify-center rounded-lg bg-white">
          <span class="text-sm font-bold text-zinc-900">D</span>
        </div>
        <span class="text-lg font-semibold text-white">Dashboard</span>
      </div>
      <blockquote class="space-y-2">
        <p class="text-lg text-zinc-200">
          "Modern yönetim paneli şablonu ile projelerinizi hızlandırın."
        </p>
        <footer class="text-sm text-zinc-400">Dashboard Template</footer>
      </blockquote>
    </div>

    <!-- Sağ panel — form -->
    <div class="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <!-- Tema toggle (sağ üst) -->
      <div class="absolute right-4 top-4">
        <button
          class="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-accent"
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
          <h1 class="text-2xl font-semibold tracking-tight text-foreground">
            {{ $t('auth.login.title') }}
          </h1>
          <p class="text-sm text-muted-foreground">{{ $t('auth.login.subtitle') }}</p>
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
            <label class="flex items-center gap-2 text-sm text-foreground">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="size-4 rounded border-input accent-primary"
              />
              {{ $t('auth.login.rememberMe') }}
            </label>
            <RouterLink
              to="/forgot-password"
              class="text-sm text-primary hover:underline"
            >
              {{ $t('auth.login.forgotPassword') }}
            </RouterLink>
          </div>

          <Button type="submit" class="w-full" :disabled="isSubmitting">
            {{ isSubmitting ? $t('common.loading') : $t('auth.login.submit') }}
          </Button>
        </form>

        <!-- Demo ipucu -->
        <p class="text-center text-xs text-muted-foreground">
          {{ $t('auth.login.demoHint') }}
        </p>
      </div>
    </div>
  </div>
</template>

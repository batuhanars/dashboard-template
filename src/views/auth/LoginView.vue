<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Sun, Moon } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { isDark, toggle: toggleTheme } = useTheme()
const { t } = useI18n()

const appName = import.meta.env.VITE_APP_NAME || 'Dashboard'

const loginSchema = computed(() =>
  toTypedSchema(
    z.object({
      email: z.string().min(1, t('validation.required')).email(t('validation.email')),
      password: z.string().min(1, t('validation.required')),
      rememberMe: z.boolean().optional(),
    }),
  ),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: loginSchema,
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
    <div class="hidden relative flex-1 flex-col justify-between overflow-hidden p-10 lg:flex" style="background: linear-gradient(145deg, #0d0d14 0%, #13131f 50%, #0f0f1a 100%);">
      <!-- Dot grid pattern -->
      <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1.5px, transparent 1.5px); background-size: 28px 28px;"></div>
      <!-- Gradient blobs -->
      <div class="absolute -top-24 -right-16 w-80 h-80 rounded-full blur-3xl pointer-events-none" style="background: radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%);"></div>
      <div class="absolute bottom-16 -left-12 w-60 h-60 rounded-full blur-3xl pointer-events-none" style="background: radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%);"></div>
      <!-- Soft horizontal line accent -->
      <div class="absolute bottom-0 left-0 right-0 h-px" style="background: linear-gradient(to right, transparent, rgba(99,102,241,0.4), transparent);"></div>

      <div class="relative flex items-center gap-3">
        <div class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/15 backdrop-blur-sm" style="background: rgba(255,255,255,0.08);">
          <span class="text-sm font-bold text-white">{{ appName.charAt(0) }}</span>
        </div>
        <span class="text-lg font-semibold tracking-tight text-white">{{ appName }}</span>
      </div>

      <blockquote class="relative space-y-4">
        <div class="mb-2 text-4xl font-bold leading-none text-white/15 select-none">"</div>
        <p class="text-[1.05rem] leading-relaxed text-zinc-300/90">"{{ $t('auth.login.marketingQuote') }}"</p>
        <footer class="flex items-center gap-3 text-sm text-zinc-500">
          <span class="block h-px w-8 rounded-full bg-zinc-600"></span>
          {{ $t('auth.login.marketingFooter') }}
        </footer>
      </blockquote>
    </div>

    <!-- Sağ panel — form -->
    <div class="bg-background flex flex-1 flex-col items-center justify-center px-6 py-12">
      <!-- Tema toggle (sağ üst) -->
      <div class="absolute top-4 right-4">
        <button
          class="border-border text-muted-foreground hover:bg-accent flex size-9 items-center justify-center rounded-lg border transition-colors"
          :title="t('theme.toggle')"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" class="size-4" />
          <Moon v-else class="size-4" />
        </button>
      </div>

      <div class="w-full max-w-sm space-y-7">
        <!-- Başlık -->
        <div class="space-y-2 text-center">
          <div class="mx-auto mb-5 flex size-11 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <span class="text-base font-bold text-primary">{{ appName.charAt(0) }}</span>
          </div>
          <h1 class="text-foreground text-2xl font-bold tracking-tight">
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
            <RouterLink to="/forgot-password" class="text-primary text-sm font-medium hover:underline">
              {{ $t('auth.login.forgotPassword') }}
            </RouterLink>
          </div>

          <Button type="submit" class="w-full font-semibold" :disabled="isSubmitting">
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

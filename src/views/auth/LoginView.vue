<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { loginRequestSchema } from '@/types/api'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginRequestSchema),
  initialValues: { email: '', password: '', rememberMe: false },
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Giriş başarısız')
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="w-full max-w-sm space-y-6 px-6">
      <div class="space-y-1 text-center">
        <h1 class="text-2xl font-semibold text-foreground">{{ $t('auth.login.title') }}</h1>
        <p class="text-sm text-muted-foreground">demo@example.com / demo123</p>
      </div>

      <form class="space-y-4" @submit="onSubmit">
        <div class="space-y-1">
          <label class="text-sm font-medium text-foreground">
            {{ $t('auth.login.email') }}
          </label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-foreground">
            {{ $t('auth.login.password') }}
          </label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <Button type="submit" class="w-full" :disabled="isSubmitting">
          {{ isSubmitting ? $t('common.loading') : $t('auth.login.submit') }}
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { CheckCircle } from 'lucide-vue-next'

const schema = z.object({ email: z.string().email('Geçerli e-posta girin') })

const { handleSubmit, isSubmitting } = useForm({ validationSchema: toTypedSchema(schema) })

const sent = ref(false)

const onSubmit = handleSubmit(async () => {
  await new Promise((r) => setTimeout(r, 800))
  sent.value = true
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-6">
    <div class="w-full max-w-sm space-y-6">
      <!-- Başarı durumu -->
      <template v-if="sent">
        <div class="space-y-4 text-center">
          <div class="flex justify-center">
            <CheckCircle class="size-12 text-emerald-500" />
          </div>
          <h1 class="text-xl font-semibold text-foreground">
            {{ $t('auth.forgotPassword.success') }}
          </h1>
          <RouterLink to="/login" class="block text-sm text-primary hover:underline">
            {{ $t('auth.forgotPassword.backToLogin') }}
          </RouterLink>
        </div>
      </template>

      <!-- Form -->
      <template v-else>
        <div class="space-y-1 text-center">
          <h1 class="text-2xl font-semibold tracking-tight text-foreground">
            {{ $t('auth.forgotPassword.title') }}
          </h1>
          <p class="text-sm text-muted-foreground">{{ $t('auth.forgotPassword.subtitle') }}</p>
        </div>

        <form class="space-y-4" @submit="onSubmit">
          <FormField
            name="email"
            type="email"
            :label="$t('auth.forgotPassword.email')"
            placeholder="ornek@eposta.com"
          />
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            {{ isSubmitting ? $t('common.loading') : $t('auth.forgotPassword.submit') }}
          </Button>
        </form>

        <div class="text-center">
          <RouterLink to="/login" class="text-sm text-muted-foreground hover:text-foreground">
            ← {{ $t('auth.forgotPassword.backToLogin') }}
          </RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>

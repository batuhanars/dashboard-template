<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import type { User } from '@/types/api'

const props = defineProps<{ user: User | null }>()

const { t } = useI18n()

const profileSchema = z.object({
  name: z.string().min(2, 'En az 2 karakter'),
  email: z.string().email('Geçerli e-posta girin'),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(profileSchema),
  initialValues: { name: props.user?.name ?? '', email: props.user?.email ?? '' },
})

const onProfileSave = handleSubmit(() => {
  toast.success(t('settings.profile.saved'))
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $t('settings.profile.title') }}</CardTitle>
      <CardDescription>{{ $t('settings.profile.subtitle') }}</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="max-w-md space-y-4" @submit="onProfileSave">
        <FormField name="name" :label="$t('settings.profile.name')" :placeholder="user?.name" />
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
</template>

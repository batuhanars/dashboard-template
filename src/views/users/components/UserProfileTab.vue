<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { api } from '@/lib/api'
import { userRoleSchema, userStatusSchema } from '@/types/api'
import type { User, UserRole, UserStatus } from '@/types/api'
import { toast } from 'vue-sonner'

const props = defineProps<{ user: User }>()

const { t } = useI18n()
const queryClient = useQueryClient()

const updateSchema = z.object({
  name: z.string().min(2, 'En az 2 karakter'),
  email: z.string().email('Geçerli e-posta girin'),
  role: userRoleSchema,
  status: userStatusSchema,
})

const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(updateSchema),
})

const { value: roleVal } = useField<UserRole>('role')
const { value: statusVal } = useField<UserStatus>('status')

watch(
  () => props.user,
  (u) => setValues({ name: u.name, email: u.email, role: u.role, status: u.status }),
  { immediate: true },
)

const updateMutation = useMutation({
  mutationFn: (patch: Partial<User>) =>
    api.users.update(props.user.id, patch as Parameters<typeof api.users.update>[1]),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    toast.success(t('users.detail.profile.saved'))
  },
  onError: () => toast.error(t('common.error')),
})

const onSubmit = handleSubmit((values) => {
  updateMutation.mutate(values)
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $t('users.detail.profile.title') }}</CardTitle>
    </CardHeader>
    <CardContent>
      <form class="max-w-md space-y-4" @submit="onSubmit">
        <FormField name="name" :label="$t('users.detail.profile.name')" placeholder="Ad Soyad" />
        <FormField
          name="email"
          type="email"
          :label="$t('users.detail.profile.email')"
          placeholder="ornek@eposta.com"
        />

        <div class="space-y-1.5">
          <Label>{{ $t('users.detail.profile.role') }}</Label>
          <Select
            :model-value="roleVal"
            @update:model-value="(v) => (roleVal = v as UserRole)"
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">{{ $t('users.roles.admin') }}</SelectItem>
              <SelectItem value="editor">{{ $t('users.roles.editor') }}</SelectItem>
              <SelectItem value="viewer">{{ $t('users.roles.viewer') }}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <Label>{{ $t('users.detail.profile.status') }}</Label>
          <Select
            :model-value="statusVal"
            @update:model-value="(v) => (statusVal = v as UserStatus)"
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{{ $t('users.statuses.active') }}</SelectItem>
              <SelectItem value="inactive">{{ $t('users.statuses.inactive') }}</SelectItem>
              <SelectItem value="pending">{{ $t('users.statuses.pending') }}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="pt-2">
          <Button type="submit" :disabled="isSubmitting || updateMutation.isPending.value">
            {{
              isSubmitting || updateMutation.isPending.value
                ? $t('common.loading')
                : $t('users.detail.profile.save')
            }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

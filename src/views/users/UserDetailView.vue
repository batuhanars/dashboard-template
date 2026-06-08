<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { userRoleSchema, userStatusSchema } from '@/types/api'
import type { UserRole, UserStatus } from '@/types/api'
import { toast } from 'vue-sonner'
import { ArrowLeft, ShieldCheck, User as UserIcon, Clock } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()
const { t } = useI18n()

const userId = computed(() => route.params.id as string)

// ── Veri çekme ─────────────────────────────────────────────────────────────

const { data: user, isPending } = useQuery({
  queryKey: computed(() => ['users', 'detail', userId.value]),
  queryFn: () => api.users.detail(userId.value),
})

const { data: activities, isPending: activitiesPending } = useQuery({
  queryKey: computed(() => ['users', 'activities', userId.value]),
  queryFn: () => api.users.activities(userId.value),
})

// ── Form (Profil tab) ──────────────────────────────────────────────────────

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
  user,
  (u) => {
    if (u) setValues({ name: u.name, email: u.email, role: u.role, status: u.status })
  },
  { immediate: true },
)

// ── Güncelleme mutasyonu ───────────────────────────────────────────────────

const updateMutation = useMutation({
  mutationFn: (patch: Partial<typeof user.value>) =>
    api.users.update(userId.value, patch as Parameters<typeof api.users.update>[1]),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    toast.success(t('users.detail.profile.saved'))
  },
  onError: () => toast.error(t('common.error')),
})

const onSubmit = handleSubmit((values) => {
  updateMutation.mutate(values)
})

// ── Yardımcılar ────────────────────────────────────────────────────────────

const activityTypeIcon: Record<string, string> = {
  login: '🔐',
  update: '✏️',
  create: '➕',
  delete: '🗑️',
  comment: '💬',
}

const roleDescKey: Record<UserRole, string> = {
  admin: 'users.detail.permissions.adminDesc',
  editor: 'users.detail.permissions.editorDesc',
  viewer: 'users.detail.permissions.viewerDesc',
}
</script>

<template>
  <div class="space-y-5">
    <!-- Başlık -->
    <div class="flex items-center gap-3">
      <button
        class="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        @click="router.back()"
      >
        <ArrowLeft class="size-4" />
      </button>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">
          {{ isPending ? $t('common.loading') : (user?.name ?? $t('users.detail.notFound')) }}
        </h1>
        <p v-if="user" class="text-sm text-muted-foreground">{{ user.email }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isPending" class="space-y-4">
      <Skeleton class="h-10 w-64" />
      <Skeleton class="h-64 rounded-lg" />
    </div>

    <!-- İçerik -->
    <Tabs v-else-if="user" default-value="profile">
      <TabsList class="mb-4">
        <TabsTrigger value="profile">
          <UserIcon class="mr-1.5 size-3.5" />
          {{ $t('users.detail.tabs.profile') }}
        </TabsTrigger>
        <TabsTrigger value="activity">
          <Clock class="mr-1.5 size-3.5" />
          {{ $t('users.detail.tabs.activity') }}
        </TabsTrigger>
        <TabsTrigger value="permissions">
          <ShieldCheck class="mr-1.5 size-3.5" />
          {{ $t('users.detail.tabs.permissions') }}
        </TabsTrigger>
      </TabsList>

      <!-- Profil tab -->
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>{{ $t('users.detail.profile.title') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <form class="max-w-md space-y-4" @submit="onSubmit">
              <FormField
                name="name"
                :label="$t('users.detail.profile.name')"
                placeholder="Ad Soyad"
              />
              <FormField
                name="email"
                type="email"
                :label="$t('users.detail.profile.email')"
                placeholder="ornek@eposta.com"
              />

              <!-- Rol seçimi -->
              <div class="space-y-1.5">
                <Label>{{ $t('users.detail.profile.role') }}</Label>
                <Select :model-value="roleVal" @update:model-value="(v) => (roleVal = v as UserRole)">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{{ $t('users.roles.admin') }}</SelectItem>
                    <SelectItem value="editor">{{ $t('users.roles.editor') }}</SelectItem>
                    <SelectItem value="viewer">{{ $t('users.roles.viewer') }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Durum seçimi -->
              <div class="space-y-1.5">
                <Label>{{ $t('users.detail.profile.status') }}</Label>
                <Select
                  :model-value="statusVal"
                  @update:model-value="(v) => (statusVal = v as UserStatus)"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{{ $t('users.statuses.active') }}</SelectItem>
                    <SelectItem value="inactive">{{ $t('users.statuses.inactive') }}</SelectItem>
                    <SelectItem value="pending">{{ $t('users.statuses.pending') }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="pt-2">
                <Button type="submit" :disabled="isSubmitting || updateMutation.isPending.value">
                  {{ isSubmitting || updateMutation.isPending.value ? $t('common.loading') : $t('users.detail.profile.save') }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Aktivite tab -->
      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <CardTitle>{{ $t('users.detail.activity.title') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="activitiesPending" class="space-y-3">
              <Skeleton v-for="i in 5" :key="i" class="h-12 rounded-lg" />
            </div>
            <div
              v-else-if="!activities?.length"
              class="py-10 text-center text-sm text-muted-foreground"
            >
              {{ $t('users.detail.activity.empty') }}
            </div>
            <ul v-else class="space-y-2">
              <li
                v-for="act in activities"
                :key="act.id"
                class="flex items-start gap-3 rounded-lg border border-border p-3"
              >
                <span class="text-base leading-none">{{ activityTypeIcon[act.type] }}</span>
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-foreground">{{ act.description }}</p>
                  <p class="mt-0.5 text-xs text-muted-foreground">{{ formatDate(act.createdAt) }}</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Yetkiler tab -->
      <TabsContent value="permissions">
        <Card>
          <CardHeader>
            <CardTitle>{{ $t('users.detail.permissions.title') }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center gap-3 rounded-lg border border-border p-4">
              <ShieldCheck class="size-8 shrink-0 text-primary" />
              <div>
                <p class="font-medium text-foreground">
                  {{ $t(`users.roles.${user.role}`) }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ $t(roleDescKey[user.role]) }}
                </p>
              </div>
            </div>

            <div class="rounded-lg border border-border p-4">
              <p class="mb-3 text-sm font-medium text-foreground">
                {{ $t('users.detail.permissions.role') }}
              </p>
              <div class="space-y-2 text-sm text-muted-foreground">
                <template v-if="user.role === 'admin'">
                  <p>✓ Kullanıcı yönetimi</p>
                  <p>✓ Sistem ayarları</p>
                  <p>✓ İçerik yönetimi</p>
                  <p>✓ Raporlar ve analitik</p>
                </template>
                <template v-else-if="user.role === 'editor'">
                  <p>✓ İçerik oluşturma ve düzenleme</p>
                  <p>✓ Medya yükleme</p>
                  <p>✗ Kullanıcı yönetimi</p>
                  <p>✗ Sistem ayarları</p>
                </template>
                <template v-else>
                  <p>✓ İçerik görüntüleme</p>
                  <p>✓ Raporları görme</p>
                  <p>✗ Düzenleme ve oluşturma</p>
                  <p>✗ Kullanıcı yönetimi</p>
                </template>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <!-- Bulunamadı -->
    <div
      v-else
      class="py-12 text-center text-sm text-muted-foreground"
    >
      {{ $t('users.detail.notFound') }}
    </div>
  </div>
</template>

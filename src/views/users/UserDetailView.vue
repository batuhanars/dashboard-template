<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/lib/api'
import { ArrowLeft, ShieldCheck, User as UserIcon, Clock } from 'lucide-vue-next'
import UserProfileTab from './components/UserProfileTab.vue'
import UserActivityTab from './components/UserActivityTab.vue'
import UserPermissionsTab from './components/UserPermissionsTab.vue'

const route = useRoute()
const router = useRouter()

const userId = computed(() => route.params.id as string)

const { data: user, isPending } = useQuery({
  queryKey: computed(() => ['users', 'detail', userId.value]),
  queryFn: () => api.users.detail(userId.value),
})
</script>

<template>
  <div class="space-y-5">
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

    <div v-if="isPending" class="space-y-4">
      <Skeleton class="h-10 w-64" />
      <Skeleton class="h-64 rounded-lg" />
    </div>

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

      <TabsContent value="profile">
        <UserProfileTab :user="user" />
      </TabsContent>

      <TabsContent value="activity">
        <UserActivityTab :user-id="userId" />
      </TabsContent>

      <TabsContent value="permissions">
        <UserPermissionsTab :user="user" />
      </TabsContent>
    </Tabs>

    <div v-else class="py-12 text-center text-sm text-muted-foreground">
      {{ $t('users.detail.notFound') }}
    </div>
  </div>
</template>

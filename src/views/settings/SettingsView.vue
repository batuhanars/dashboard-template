<script setup lang="ts">
import SettingsProfileForm from './components/SettingsProfileForm.vue'
import SettingsAppearance from './components/SettingsAppearance.vue'
import SettingsNotifications from './components/SettingsNotifications.vue'
import SettingsDangerZone from './components/SettingsDangerZone.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
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

      <TabsContent value="profile">
        <SettingsProfileForm :user="user" />
      </TabsContent>
      <TabsContent value="appearance">
        <SettingsAppearance />
      </TabsContent>
      <TabsContent value="notifications">
        <SettingsNotifications />
      </TabsContent>
      <TabsContent value="danger">
        <SettingsDangerZone />
      </TabsContent>
    </Tabs>
  </div>
</template>

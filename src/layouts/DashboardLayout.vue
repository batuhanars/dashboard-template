<script setup lang="ts">
const mobileOpen = ref(false)
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <AppSidebar class="hidden flex-shrink-0 lg:flex" />

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <AppHeader @open-mobile-menu="mobileOpen = true" />
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>

  <Sheet v-model:open="mobileOpen">
    <SheetContent side="left" class="w-60 p-0">
      <SheetTitle class="sr-only">{{ $t('layout.sidebar') }}</SheetTitle>
      <AppSidebar />
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

const crumbs = computed(() =>
  route.matched.filter((r) => r.meta.titleKey).map((r) => ({
    name: String(r.name ?? ''),
    label: t(r.meta.titleKey as string),
    path: r.path || '/',
  })),
)
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(crumb, i) in crumbs" :key="crumb.name">
        <BreadcrumbItem>
          <BreadcrumbLink v-if="i < crumbs.length - 1" as-child>
            <RouterLink :to="crumb.path">{{ crumb.label }}</RouterLink>
          </BreadcrumbLink>
          <BreadcrumbPage v-else>{{ crumb.label }}</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="i < crumbs.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

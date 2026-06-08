import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    layout?: 'auth' | 'dashboard'
    titleKey?: string
  }
}

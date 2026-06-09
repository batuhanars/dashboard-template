import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { User, UserRole, UserStatus } from '@/types/api'
import { formatDate } from '@/lib/format'
import { Eye, Trash2 } from 'lucide-vue-next'

const statusClass: Record<UserStatus, string> = {
  active:
    'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  inactive:
    'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
  pending:
    'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
}

const roleClass: Record<UserRole, string> = {
  admin:
    'bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800',
  editor:
    'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  viewer:
    'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
}

export function useUsersColumns(onView: (user: User) => void, onDelete: (user: User) => void) {
  const { t } = useI18n()

  const columns = computed<ColumnDef<User, unknown>[]>(() => [
    {
      accessorKey: 'name',
      header: () => t('users.columns.name'),
      enableSorting: true,
      cell: ({ row }) => {
        const initials = row.original.name
          .split(' ')
          .map((w: string) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
        return h('div', { class: 'flex items-center gap-3' }, [
          h(
            'div',
            { class: 'flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold select-none' },
            initials,
          ),
          h('div', { class: 'flex min-w-0 flex-col gap-0.5' }, [
            h('span', { class: 'font-medium text-foreground truncate' }, row.original.name),
            h('span', { class: 'text-xs text-muted-foreground truncate' }, row.original.email),
          ]),
        ])
      },
    },
    {
      accessorKey: 'role',
      header: () => t('users.columns.role'),
      enableSorting: true,
      cell: ({ row }) =>
        h(
          'span',
          {
            class: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${roleClass[row.original.role]}`,
          },
          t(`users.roles.${row.original.role}`),
        ),
    },
    {
      accessorKey: 'status',
      header: () => t('users.columns.status'),
      enableSorting: true,
      cell: ({ row }) =>
        h(
          'span',
          {
            class: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[row.original.status]}`,
          },
          t(`users.statuses.${row.original.status}`),
        ),
    },
    {
      accessorKey: 'createdAt',
      header: () => t('users.columns.createdAt'),
      enableSorting: true,
      cell: ({ row }) =>
        h(
          'span',
          { class: 'text-sm text-muted-foreground' },
          formatDate(row.original.createdAt),
        ),
    },
    {
      id: 'actions',
      header: () => null,
      enableSorting: false,
      cell: ({ row }) =>
        h('div', { class: 'flex items-center gap-1' }, [
          h(
            'button',
            {
              class:
                'flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground',
              title: t('users.actions.view'),
              onClick: () => onView(row.original),
            },
            [h(Eye, { class: 'size-4' })],
          ),
          h(
            'button',
            {
              class:
                'flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
              title: t('users.actions.delete'),
              onClick: () => onDelete(row.original),
            },
            [h(Trash2, { class: 'size-4' })],
          ),
        ]),
    },
  ])

  return { columns }
}

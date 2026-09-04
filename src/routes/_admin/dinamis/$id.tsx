import { createFileRoute } from '@tanstack/react-router'
import { DinamisDetailPage } from '../../../pages/Dinamis/DinamisDetailPage'

export const Route = createFileRoute('/_admin/dinamis/$id')({
  component: DinamisDetailPage,
  head: () => ({
    meta: [
      {
        title: 'Detail Dinamis',
      },
    ],
  }),
})

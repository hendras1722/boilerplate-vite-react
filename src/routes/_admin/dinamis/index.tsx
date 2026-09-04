import { createFileRoute } from '@tanstack/react-router'
import { DinamisPage } from '../../../pages/Dinamis/DinamisPage'

export const Route = createFileRoute('/_admin/dinamis/')({
  component: DinamisPage,
  head: () => ({
    meta: [
      {
        title: 'Halaman Dinamis',
      },
    ],
  }),
})

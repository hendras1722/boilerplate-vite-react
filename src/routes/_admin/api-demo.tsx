import { createFileRoute } from '@tanstack/react-router'
import { ApiDemo } from '../../pages/Dashboard/ApiDemo'

export const Route = createFileRoute('/_admin/api-demo')({
  component: ApiDemo,
})

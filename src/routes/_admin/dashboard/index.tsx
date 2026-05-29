import { createFileRoute } from '@tanstack/react-router'
import { DashboardOverview } from '../../../pages/Dashboard/DashboardOverview'

export const Route = createFileRoute('/_admin/dashboard/')({
  component: DashboardOverview,
})

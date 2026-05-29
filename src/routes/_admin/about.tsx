import { createFileRoute } from '@tanstack/react-router'
import { DashboardAbout } from '../../pages/Dashboard/DashboardAbout'

export const Route = createFileRoute('/_admin/about')({
  component: DashboardAbout,
})

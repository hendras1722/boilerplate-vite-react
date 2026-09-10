import { createFileRoute } from '@tanstack/react-router'
import { WsDemo } from '../../pages/Dashboard/WsDemo'

export const Route = createFileRoute('/_admin/ws-demo')({
  component: WsDemo,
})

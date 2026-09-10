import type { Plugin } from 'vite'
import { startWsServer } from '../server/ws/wsServer.ts'

export function wsServerPlugin(): Plugin {
  let started = false

  return {
    name: 'ws-server',
    configureServer() {
      if (started) return
      started = true
      startWsServer()
    },
    configurePreviewServer() {
      if (started) return
      started = true
      startWsServer()
    },
  }
}

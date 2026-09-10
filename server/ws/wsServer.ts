const clients = new Set<import('bun').ServerWebSocket>()

export function startWsServer(port = 3001) {
  const server = Bun.serve({
    port,
    fetch(req, server) {
      if (server.upgrade(req)) return
      return new Response('Upgrade failed', { status: 400 })
    },
    websocket: {
      open(ws) {
        clients.add(ws)
      },
      message(_ws, message) {
        for (const client of clients) client.send(message)
      },
      close(ws) {
        clients.delete(ws)
      },
    },
  })

  console.log(`WebSocket server running on ws://localhost:${server.port}`)
  return server
}

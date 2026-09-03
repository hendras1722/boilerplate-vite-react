import type { Plugin, Connect } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { readdirSync, statSync } from 'node:fs'
import { join, relative, sep, extname } from 'node:path'
import { pathToFileURL } from 'node:url'

type ApiHandler = (req: Request) => Promise<Response> | Response
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type RouteModule = Partial<Record<HttpMethod, ApiHandler>>

const ROUTES_DIR = join(import.meta.dirname, '..', 'server', 'routes')

function walk(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) files.push(...walk(full))
    else if (extname(full) === '.ts') files.push(full)
  }
  return files
}

function filePathToRoute(file: string): string {
  const rel = relative(ROUTES_DIR, file)
    .replace(/\.ts$/, '')
    .split(sep)
    .join('/')
    .replace(/(^|\/)index$/, '')

  return '/' + rel
}

async function loadRoutes(): Promise<Record<string, RouteModule>> {
  const routes: Record<string, RouteModule> = {}
  for (const file of walk(ROUTES_DIR)) {
    const url = `${pathToFileURL(file).href}?t=${Date.now()}`
    routes[filePathToRoute(file)] = await import(url)
  }
  return routes
}

async function toWebRequest(req: IncomingMessage, path: string): Promise<Request> {
  const chunks: Buffer[] = []
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    for await (const chunk of req) chunks.push(chunk as Buffer)
  }
  const body = chunks.length ? Buffer.concat(chunks) : undefined

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value)
    else if (Array.isArray(value)) headers.set(key, value.join(', '))
  }

  return new Request(`http://localhost${path}`, {
    method: req.method,
    headers,
    body,
  })
}

async function sendWebResponse(res: ServerResponse, webRes: Response) {
  res.statusCode = webRes.status
  webRes.headers.forEach((value, key) => res.setHeader(key, value))
  const body = webRes.body ? Buffer.from(await webRes.arrayBuffer()) : null
  res.end(body)
}

export function apiServerPlugin(): Plugin {
  let routes: Record<string, RouteModule> = {}

  return {
    name: 'api-server',
    async configureServer(server) {
      routes = await loadRoutes()

      server.watcher.add(ROUTES_DIR)
      server.watcher.on('add', async (file) => {
        if (file.startsWith(ROUTES_DIR)) routes = await loadRoutes()
      })
      server.watcher.on('unlink', async (file) => {
        if (file.startsWith(ROUTES_DIR)) routes = await loadRoutes()
      })
      server.watcher.on('change', async (file) => {
        if (file.startsWith(ROUTES_DIR)) routes = await loadRoutes()
      })

      const middleware: Connect.NextHandleFunction = (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()

        const path = req.url.replace(/^\/api/, '')
        const [routePath] = path.split('?')
        const handler = routes[routePath]?.[req.method as HttpMethod]

        if (!handler) {
          res.statusCode = 404
          res.end(JSON.stringify({ message: 'Not Found' }))
          return
        }

        toWebRequest(req, path)
          .then(handler)
          .then((webRes) => sendWebResponse(res, webRes))
          .catch(next)
      }

      server.middlewares.use(middleware)
    },
  }
}

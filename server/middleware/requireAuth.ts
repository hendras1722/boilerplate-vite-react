import { verifyJwt } from '../lib/jwt'

type ApiHandler = (req: Request) => Promise<Response> | Response

export function requireAuth(handler: ApiHandler): ApiHandler {
  return async (req) => {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    const payload = token ? await verifyJwt(token) : null

    if (!payload) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    return handler(req)
  }
}

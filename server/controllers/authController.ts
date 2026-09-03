import { findUserByCredentials } from '../models/userModel'
import { issueRefreshToken, consumeRefreshToken } from '../models/refreshTokenModel'
import { signJwt } from '../lib/jwt'

const ACCESS_TTL = 15 * 60

async function issueTokens(userId: number) {
  return {
    access_token: await signJwt({ sub: userId }, ACCESS_TTL),
    refresh_token: issueRefreshToken(userId),
  }
}

export async function handleLogin(req: Request) {
  const body = await req.json().catch(() => null) as { username?: string; password?: string } | null
  const user = findUserByCredentials(body?.username)
  const isMatch = await Bun.password.verify(body?.password ?? '', user?.password ?? '')

  if (!isMatch || !user?.id) {
    return Response.json({ message: 'Invalid username or password' }, { status: 401 })
  }

  return Response.json({ data: await issueTokens(user.id) })
}

export async function handleRefresh(req: Request) {
  const body = await req.json().catch(() => null) as { refresh_token?: string } | null
  const userId = body?.refresh_token ? consumeRefreshToken(body.refresh_token) : null

  if (!userId) {
    return Response.json({ message: 'Invalid or expired refresh token' }, { status: 409 })
  }

  return Response.json({ data: await issueTokens(userId) })
}

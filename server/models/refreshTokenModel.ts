import { randomUUID } from 'node:crypto'

const REFRESH_TTL = 7 * 24 * 60 * 60

const refreshTokens = new Map<string, { userId: number; expires_at: number }>()

export function issueRefreshToken(userId: number) {
  const token = randomUUID()
  refreshTokens.set(token, { userId, expires_at: Date.now() + REFRESH_TTL * 1000 })
  return token
}

export function consumeRefreshToken(token: string) {
  const entry = refreshTokens.get(token)
  if (!entry || entry.expires_at < Date.now()) return null

  refreshTokens.delete(token)
  return entry.userId
}

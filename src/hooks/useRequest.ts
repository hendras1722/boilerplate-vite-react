import { ofetch, FetchError } from 'ofetch'
import type { FetchOptions } from 'ofetch'
import z from 'zod'
import { toast } from './useToast'
import { useAuth } from './useAuth'

type HTTPMethod = 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE'

export interface RequestOptions extends Omit<FetchOptions, 'headers' | 'method' | 'body' | 'query'> {
  headers?: HeadersInit
  method?: Readonly<HTTPMethod | Lowercase<HTTPMethod>>
  body?: Record<string, unknown>
  query?: Record<string, unknown>
}

interface CustomErrorResponse {
  title: string
  description: string
}

export interface FormRefInstance {
  setErrors: (errors: Array<{ name: string; message: string }>) => void
}

export type FormErrorMapping = Record<string, string | RegExp | ((responseField: string) => string | undefined)>

export const API_URL = String(import.meta.env.VITE_API_URL ?? import.meta.env.API_URL ?? '').replace(/\/+$/, '')

const fieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
})

interface JwtPayload {
  exp?: number
  [key: string]: unknown
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload) as JwtPayload
  } catch {
    return null
  }
}

let refreshPromise: Promise<{ access_token: string; refresh_token?: string }> | null = null

async function refreshTokensOnce(): Promise<{ access_token: string; refresh_token?: string }> {
  if (refreshPromise) return refreshPromise

  const auth = useAuth.getState()
  const authState = auth.state ?? {}
  const refresh_token = authState.refresh_token
  const current_token = authState.token

  const isDev = import.meta.env.DEV
  const path = '/auth/refresh'

  const baseURL = !path.startsWith('/api-dev') ? (!isDev ? API_URL || undefined : undefined) : undefined
  const hasPrefixPath = isDev && !path.startsWith('/api-dev') && !baseURL
  const _path = hasPrefixPath ? '/api'.concat(path) : path

  const headers = new Headers({ 'Content-Type': 'application/json' })
  if (current_token) {
    headers.set('Authorization', `Bearer ${current_token}`)
  }

  refreshPromise = (async () => {
    try {
      if (!refresh_token) {
        throw new Error('No refresh token')
      }

      const res = await ofetch<Record<string, Record<string, string>>>(_path, {
        baseURL,
        method: 'POST',
        headers,
        body: { refresh_token },
      })

      const access = res?.data?.access_token
      const newRefresh = res?.data?.refresh_token

      if (!access) {
        throw new Error('Invalid refresh response')
      }

      const payload = decodeJwt(access)
      const expires_at = payload?.exp ? payload.exp * 1000 : undefined

      auth.setState({
        ...authState,
        token: access,
        refresh_token: newRefresh ?? authState.refresh_token,
        expires_at,
      })

      return { access_token: access, refresh_token: newRefresh }
    } catch (err) {
      const fetchErr = err as FetchError
      const errorStatus = fetchErr.response?.status
      const responseData = fetchErr.response?._data as Record<string, string> | undefined
      const description = responseData?.message

      if (errorStatus === 409) {
        toast.add({
          description: description || 'Conflict occurred during refresh',
          color: 'error',
          duration: 4000,
        })

        setTimeout(() => {
          auth.clear()
          window.location.replace('/login')
        }, 4000)

        throw err
      }

      throw err
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/**
 * Fetch API request
 * @param path - API path
 * @param options - ofetch options
 * @returns object
 */
export async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}) {
  const isDev = import.meta.env.DEV
  const isAbsolute = path.startsWith('http://') || path.startsWith('https://')

  const baseURL = isAbsolute
    ? undefined
    : !path.startsWith('/api-dev')
      ? options?.baseURL ?? (!isDev ? API_URL || undefined : undefined)
      : undefined

  const hasPrefixPath = isDev && !path.startsWith('/api-dev') && !path.startsWith('/api/') && !baseURL && !isAbsolute
  let _path = hasPrefixPath ? '/api'.concat(path) : path

  if (baseURL && _path.startsWith('/api/')) {
    _path = _path.replace(/^\/api/, '')
  }
  const auth = useAuth.getState()

  const instance = ofetch.create({
    baseURL: isValidURL(baseURL ?? '') ? baseURL : undefined,
    method: 'GET',
    timeout: 30000,
    retry: false,
    async onRequest() {
      // const tokenState = auth.state

      // if (tokenState?.expires_at && tokenState?.refresh_token) {
      //   const buffer = 60 * 1000
      //   if (Date.now() > tokenState.expires_at - buffer) {
      // await refreshTokensOnce()
      //   }
      // }

      // const freshToken = auth.state?.token

      // if (freshToken) {
      //   const headers = new Headers(options.headers)
      //   headers.set('Authorization', `Bearer ${freshToken}`)
      //   options.headers = headers
      // }
    },

    async onResponseError({ request, options: requestOptions, response }) {
      const responseData = response?._data as Record<string, string> | undefined
      if (response?.status === 409) {
        const description = responseData?.message

        toast.add({
          description: description || 'Conflict occurred',
          color: 'error',
          duration: 4000,
        })

        setTimeout(() => {
          auth.clear()
          window.location.replace('/login')
        }, 4000)

        return
      }

      if (response?.status === 401 && auth.state?.refresh_token) {
        try {
          const { access_token } = await refreshTokensOnce()
          const headers = new Headers(requestOptions.headers)
          headers.set('Authorization', `Bearer ${access_token}`)
          requestOptions.headers = headers

          return ofetch(request, requestOptions) as unknown as Promise<void>
        } catch (error) {
          auth.clear()
          window.location.replace('/login')
          throw error
        }
      }
    },
  })

  const raw = await instance.raw(_path, options)
  return { raw, res: raw._data as T }
}

function mappingErrorNameField(field: string, map?: FormErrorMapping): string {
  if (!map) {
    return field
  }

  const name = Object.entries(map).reduce((result, [key, target]) => {
    if (typeof target === 'string' && target === field) {
      return key
    }

    if (target instanceof RegExp && target.test(field)) {
      return key
    }

    const transformResult = typeof target === 'function' && target(field)
    if (typeof transformResult === 'string') {
      return transformResult
    }

    return result
  }, field)

  return name
}

function toArray<T>(value: unknown): T[] {
  if (value === null || value === undefined) return []
  return Array.isArray(value) ? (value as T[]) : [value as T]
}

/**
 * Parse field errors
 * @param err - Error response
 * @returns array
 */
function parseErrorFields(err: unknown, mapping?: FormErrorMapping): Array<{ name: string; message: string }> {
  // Handle TanStack Start RPC validation errors (stringified JSON)
  if (err instanceof Error) {
    try {
      const parsed = JSON.parse(err.message)
      if (parsed && Array.isArray(parsed.issues)) {
        return parsed.issues.map((issue: { path: (string | number)[]; message: string }) => ({
          name: mappingErrorNameField(issue.path.join('.'), mapping),
          message: issue.message
        }))
      }
    } catch {
      // Not a JSON error, continue to fetch error parsing
    }
  }

  const fetchErr = err as FetchError
  const responseData = fetchErr.response?._data as Record<string, unknown> | undefined
  const data = responseData?.data ?? responseData

  const errors = toArray<z.output<typeof fieldErrorSchema>>(data)
  const isValidErrors = errors.length > 0 && errors.every(item => fieldErrorSchema.safeParse(item).success)

  if (!isValidErrors) {
    return []
  }

  return errors.map(item => ({ name: mappingErrorNameField(item.field, mapping), message: item.message }))
}

function ucFirstChar(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Parse error request
 * @param err - Error response
 * @param customResponse - Custom error response to show in toast
 * @param formRef - React form ref containing setErrors
 * @param errorFieldMap - Mapping of API error fields to form field names
 */
export function handleRequestError(
  err: unknown,
  customResponse: CustomErrorResponse | null = null,
  formRef?: React.RefObject<FormRefInstance | null> | null,
  errorFieldMap?: FormErrorMapping,
) {
  if (customResponse) {
    toast.add({ ...customResponse, color: 'error' })
    return
  }

  const errors = parseErrorFields(err, errorFieldMap)
  if (errors.length > 0) {
    if (formRef?.current) {
      formRef.current.setErrors(errors)
      return
    }

    errors.forEach((item) => {
      const description = [ucFirstChar(item.name.replace(/_/g, ' ')), item.message].join(' ').trim()
      toast.add({ description, color: 'error' })
    })
    return
  }

  const fetchErr = err as FetchError
  const responseData = fetchErr?.response?._data as Record<string, unknown> | undefined
  if (responseData) {
    const description = typeof responseData.message === 'string' ? responseData.message : fetchErr.response?.statusText
    toast.add({ description: description || 'Response error occurred', color: 'error' })
    return
  }

  if (typeof err === 'string') {
    toast.add({ description: err, color: 'error' })
    return
  }

  const standardErr = err as Error
  toast.add({ description: typeof standardErr?.message === 'string' ? standardErr.message : 'Something went wrong', color: 'error' })
}

function isValidURL(url: string): boolean {
  try {
    const result = new URL(url)
    return ['http:', 'https:'].includes(result.protocol)
  } catch {
    return false
  }
}

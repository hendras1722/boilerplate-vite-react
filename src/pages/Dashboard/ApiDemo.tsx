import { useState, useEffect, useRef } from 'react'
import { apiRequest, handleRequestError } from '../../hooks/useRequest'
import type { FormErrorMapping } from '../../hooks/useRequest'
import { useAuth } from '../../hooks/useAuth'
import { toast } from '../../hooks/useToast'
import { Table } from '@radix-ui/themes'
import { Server, Send, AlertTriangle, RefreshCw, Key, ShieldAlert } from 'lucide-react'
import { Form, FormField } from '../../components/ui/Form'
import type { FormRefInstance } from '../../components/ui/Form'
import z from 'zod'
import { InputField } from '../../components/ui/InputField'
import { TextArea } from '../../components/ui/TextArea'
import { Button } from '../../components/ui/Button'

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

// Zod validation schema matching form requirements
const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  body: z.string().min(10, 'Body must be at least 10 characters long')
})

export function ApiDemo() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  // Auth state
  const auth = useAuth()

  // Form state
  const [formState, setFormState] = useState({ title: '', body: '' })
  const [submitting, setSubmitting] = useState(false)
  const [isExpired, setIsExpired] = useState(false)

  // Reactive expiration state using side-effect (useEffect) to keep rendering pure
  useEffect(() => {
    let active = true

    const checkExpiration = async () => {
      // Defer execution to avoid calling state updates synchronously inside the effect body
      await Promise.resolve()
      if (!active) return

      if (!auth.state.expires_at) {
        setIsExpired(false)
        return
      }
      setIsExpired(auth.state.expires_at < Date.now())
    }

    checkExpiration()

    const interval = setInterval(() => {
      if (active && auth.state.expires_at) {
        setIsExpired(auth.state.expires_at < Date.now())
      }
    }, 1000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [auth.state.expires_at])

  // Form Ref instance to pass to handleRequestError
  const formRefInstance = useRef<FormRefInstance | null>(null)

  // Fetch posts from JSONPlaceholder
  const fetchPosts = async () => {
    setLoading(true)
    try {
      // JSONPlaceholder is a public API
      const { res } = await apiRequest<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=5', {
        baseURL: '' // override default VITE_API_URL
      })
      setPosts(res)
      toast.success('Successfully loaded posts from JSONPlaceholder!', 'Success Fetch', 3000)
    } catch (err) {
      handleRequestError(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch posts on mount
  useEffect(() => {
    let active = true
    const loadPosts = async () => {
      // Defer execution to avoid calling state updates synchronously inside the effect body
      await Promise.resolve()
      if (!active) return
      setLoading(true)
      try {
        const { res } = await apiRequest<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=5', {
          baseURL: ''
        })
        if (active) {
          setPosts(res)
          toast.success('Successfully loaded posts from JSONPlaceholder!', 'Success Fetch', 3000)
        }
      } catch (err) {
        if (active) handleRequestError(err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadPosts()
    return () => {
      active = false
    }
  }, [])

  // Handle post creation
  const handleCreatePost = async () => {
    setSubmitting(true)

    try {
      const { res } = await apiRequest<Post>('https://jsonplaceholder.typicode.com/posts', {
        baseURL: '',
        method: 'POST',
        body: {
          title: formState.title,
          body: formState.body,
          userId: 1
        }
      })

      toast.success(`Successfully created post #${res.id}: "${res.title}"`, 'Post Created')

      // Add to local list
      setPosts((prev) => [res, ...prev.slice(0, 4)])
      setFormState({ title: '', body: '' })
    } catch (err) {
      handleRequestError(err, null, formRefInstance)
    } finally {
      setSubmitting(false)
    }
  }

  // Simulate Form field errors
  const handleSimulateFormErrors = () => {
    // Create a mock FetchError containing validation field errors
    const mockError = {
      name: 'FetchError',
      response: {
        status: 422,
        _data: {
          data: [
            { field: 'api_title', message: 'must not contain numeric characters' },
            { field: 'api_body', message: 'must be at least 15 characters long' }
          ]
        }
      }
    }

    // Mapping API fields to local form fields
    const errorMap: FormErrorMapping = {
      title: 'api_title',
      body: 'api_body'
    }

    // Call handleRequestError passing formRefInstance to verify errors are set
    handleRequestError(mockError, null, formRefInstance, errorMap)
  }

  // Simulate Global Toast Field Errors (when formRef is NOT passed)
  const handleSimulateToastErrors = () => {
    const mockError = {
      name: 'FetchError',
      response: {
        status: 422,
        _data: {
          data: [
            { field: 'username', message: 'has already been taken' },
            { field: 'password', message: 'is too weak' }
          ]
        }
      }
    }

    // Calls handleRequestError without formRef, so errors display as toasts
    handleRequestError(mockError, null, null)
  }

  // Simulate 409 Conflict (Redirect flow)
  const handleSimulate409 = () => {
    const mockError = {
      name: 'FetchError',
      response: {
        status: 409,
        _data: {
          message: 'Conflict: Your account has been logged in on another device.'
        }
      }
    }

    handleRequestError(mockError)
  }

  // Set Expired Mock Token
  const handleSetExpiredToken = () => {
    auth.setState({
      token: 'mock_expired_jwt_token',
      refresh_token: 'mock_refresh_token_xyz',
      expires_at: Date.now() - 10000 // 10s in the past
    })

    toast.info('Mock expired token and refresh token have been saved to Zustand store.', 'Mock Auth Initialized')
  }

  // Set Valid Mock Token
  const handleSetValidToken = () => {
    auth.setState({
      token: 'mock_valid_jwt_token_abc',
      refresh_token: 'mock_refresh_token_xyz',
      expires_at: Date.now() + 3600000 // 1 hour in the future
    })

    toast.success('Mock valid token saved to Zustand store.', 'Mock Auth Initialized')
  }

  // Clear Auth State
  const handleClearAuth = () => {
    auth.clear()
    toast.warning('Zustand auth store cleared successfully.', 'Auth Cleared')
  }

  // Simulate 401 Unauthorized which triggers token refresh
  const handleSimulateRequestWithAuth = async () => {
    toast.info('Triggering request. Check browser dev console to see interceptor checks.', 'Request Initiated')

    try {
      await apiRequest('https://jsonplaceholder.typicode.com/posts/1', {
        baseURL: ''
      })

      toast.success('Request completed successfully.', 'Request Success')
    } catch (err) {
      handleRequestError(err)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div>
        <h1 className="!my-0 text-[2rem] font-bold text-[var(--text-primary)]">ofetch & zustand Request Composable Demo</h1>
        <p className="text-[var(--text-secondary)] m-0">
          Testing and demonstrating converted React request hooks and state management stores using JSONPlaceholder.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

        {/* Left Side: Fetching list & Creating Posts */}
        <div className="flex flex-col gap-8 lg:col-span-7">

          {/* Post Creation Form */}
          <div className="bg-[var(--do-card-bg)] border border-[var(--do-card-border)] rounded-2xl p-6 backdrop-blur-[10px] shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Send size={18} className="text-[var(--accent)]" />
              <h3>Create Post (apiRequest POST)</h3>
            </div>

            <Form
              ref={formRefInstance}
              state={formState}
              schema={postSchema}
              onSubmit={handleCreatePost}
              className="flex flex-col gap-5"
            >
              <FormField name="title">
                <InputField
                  id="post-title"
                  label="Title"
                  placeholder="Enter post title"
                  value={formState.title}
                  onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                />
              </FormField>

              <FormField name="body">
                <TextArea
                  id="post-body"
                  label="Body"
                  placeholder="Enter post body text"
                  value={formState.body}
                  onChange={(e) => setFormState((prev) => ({ ...prev, body: e.target.value }))}
                />
              </FormField>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  loading={submitting}
                  icon={<Send size={14} />}
                >
                  Submit Post
                </Button>

                <Button
                  type="button"
                  variant="soft"
                  color="red"
                  onClick={handleSimulateFormErrors}
                >
                  Simulate Form Errors
                </Button>
              </div>
            </Form>
          </div>

          {/* Posts list */}
          <div className="bg-[var(--do-card-bg)] border border-[var(--do-card-border)] rounded-2xl p-6 backdrop-blur-[10px] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Server size={18} className="text-[var(--accent)]" />
                <h3>Latest Posts ({posts.length})</h3>
              </div>
              <Button
                variant="ghost"
                onClick={fetchPosts}
                loading={loading}
                icon={<RefreshCw size={14} />}
              >
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="text-center p-8 text-[var(--text-secondary)]">
                <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                Loading posts...
              </div>
            ) : (
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Snippet</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {posts.map((post) => (
                    <Table.Row key={post.id}>
                      <Table.RowHeaderCell>{post.id}</Table.RowHeaderCell>
                      <Table.Cell className="font-semibold">{post.title}</Table.Cell>
                      <Table.Cell className="text-[var(--text-secondary)] text-[0.85rem]">
                        {post.body.substring(0, 80)}...
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </div>
        </div>

        {/* Right Side: Auth Expiration, 401 Auto Refresh, 409 Conflict Simulation */}
        <div className="flex flex-col gap-8 lg:col-span-5">

          {/* Zustand Auth Store Panel */}
          <div className="bg-[var(--do-card-bg)] border border-[var(--do-card-border)] rounded-2xl p-6 backdrop-blur-[10px] shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Key size={18} className="text-[var(--accent)]" />
              <h3>Zustand Auth Store State</h3>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-1 p-3 rounded-md bg-[var(--code-bg)] font-[var(--mono)] text-[0.85rem]">
                <div><strong>Token:</strong> {auth.state.token || <span className="text-[var(--text-secondary)] opacity-50">undefined</span>}</div>
                <div><strong>Refresh Token:</strong> {auth.state.refresh_token || <span className="text-[var(--text-secondary)] opacity-50">undefined</span>}</div>
                <div>
                  <strong>Expires At:</strong>{' '}
                  {auth.state.expires_at ? (
                    <span>
                      {new Date(auth.state.expires_at).toLocaleTimeString()}{' '}
                      {isExpired ? (
                        <span className="text-red-500 font-bold">(Expired)</span>
                      ) : (
                        <span className="text-emerald-500 font-semibold">(Valid)</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-[var(--text-secondary)] opacity-50">undefined</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="soft"
                  color="green"
                  onClick={handleSetValidToken}
                >
                  Set Valid Mock Token
                </Button>

                <Button
                  variant="soft"
                  color="amber"
                  onClick={handleSetExpiredToken}
                >
                  Set Expired Mock Token
                </Button>

                <Button
                  variant="soft"
                  color="gray"
                  onClick={handleClearAuth}
                >
                  Clear Auth
                </Button>
              </div>
            </div>

            <p className="text-[0.85rem] text-[var(--text-secondary)] leading-relaxed">
              Setting an <strong>Expired Mock Token</strong> and triggering a request simulates the onRequest token expiration check logic, automatically invoking the token refresh routine before sending the primary API request.
            </p>
          </div>

          {/* Request Error Interceptors Demo */}
          <div className="bg-[var(--do-card-bg)] border border-[var(--do-card-border)] rounded-2xl p-6 backdrop-blur-[10px] shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <ShieldAlert size={18} className="text-red-500" />
              <h3>Error Interceptors Simulation</h3>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="soft"
                onClick={handleSimulateRequestWithAuth}
                icon={<RefreshCw size={14} />}
                className="w-full justify-center"
              >
                Trigger Request (Checks token validity)
              </Button>

              <Button
                variant="soft"
                color="red"
                onClick={handleSimulateToastErrors}
                icon={<AlertTriangle size={14} />}
                className="w-full justify-center"
              >
                Simulate Global Field Toasts
              </Button>

              <Button
                variant="solid"
                color="red"
                onClick={handleSimulate409}
                icon={<ShieldAlert size={14} />}
                className="w-full justify-center"
              >
                Simulate 409 Conflict (Redirects to /login)
              </Button>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
              <span className="text-[0.8rem] text-red-500 font-semibold block mb-1">
                Note on 409 Conflict Redirect:
              </span>
              <p className="text-[0.78rem] text-[var(--text-secondary)] m-0 leading-normal">
                A 409 status code represents a conflict (e.g. dual logins). In the request settings, a 409 automatically triggers an error notification toast and forces a login redirect after a 4-second delay.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

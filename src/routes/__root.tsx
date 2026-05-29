import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Theme } from '@radix-ui/themes'
import { NotFound } from '../pages/NotFound/NotFound'

export const Route = createRootRoute({
  component: () => (
    <Theme accentColor="violet" grayColor="slate" panelBackground="translucent" radius="large" scaling="100%">
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </Theme>
  ),
  notFoundComponent: () => (
    <Theme accentColor="violet" grayColor="slate" panelBackground="translucent" radius="large" scaling="100%">
      <NotFound />
    </Theme>
  ),
})


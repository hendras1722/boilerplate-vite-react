import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Theme } from '@radix-ui/themes'
import { NotFound } from '../pages/NotFound/NotFound'
import { ToastContainer } from '../components/ui/ToastContainer'

import { TitleSync } from '../components/TitleSync'

export const Route = createRootRoute({
  component: () => (
    <Theme accentColor="violet" grayColor="slate" panelBackground="translucent" radius="large" scaling="100%">
      <TitleSync />
      <Outlet />
      <ToastContainer />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </Theme>
  ),
  notFoundComponent: () => (
    <Theme accentColor="violet" grayColor="slate" panelBackground="translucent" radius="large" scaling="100%">
      <TitleSync />
      <NotFound />
      <ToastContainer />
    </Theme>
  ),
})

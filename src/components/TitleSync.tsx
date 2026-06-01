import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'

export function TitleSync() {
  const matches = useRouterState({ select: (s) => s.matches })
  
  useEffect(() => {
    // Find the deepest match with a title
    const matchWithTitle = [...matches].reverse().find(d => 
      d.meta?.some(m => m && m.title)
    )
    
    const titleMeta = matchWithTitle?.meta?.find(m => m && m.title)
    if (titleMeta && titleMeta.title) {
      document.title = titleMeta.title
    } else {
      document.title = 'boilerplate-msa-vite' // Fallback
    }
  }, [matches])

  return null
}

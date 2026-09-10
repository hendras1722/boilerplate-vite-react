import { useEffect, useRef, useState } from 'react'

export function useWebSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.onopen = () => setIsOpen(true)
    socket.onclose = () => setIsOpen(false)
    socket.onmessage = (event) => setMessages((prev) => [...prev, event.data])

    return () => socket.close()
  }, [url])

  const send = (data: string) => {
    socketRef.current?.send(data)
  }

  return { isOpen, messages, send }
}

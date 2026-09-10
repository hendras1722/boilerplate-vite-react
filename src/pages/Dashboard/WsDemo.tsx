import { useState } from 'react'
import { useWebSocket } from '../../hooks/useWebSocket'
import { Radio, Send } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { InputField } from '../../components/ui/InputField'

const WS_URL = 'ws://localhost:3001'

export function WsDemo() {
  const { isOpen, messages, send } = useWebSocket(WS_URL)
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (!message.trim()) return
    send(message)
    setMessage('')
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="!my-0 text-[2rem] font-bold text-[var(--text-primary)]">Bun WebSocket Demo</h1>
        <p className="text-[var(--text-secondary)] m-0">
          Testing native Bun.serve WebSocket connection at {WS_URL}.
        </p>
      </div>

      <div className="bg-[var(--do-card-bg)] border border-[var(--do-card-border)] rounded-2xl p-6 backdrop-blur-[10px] shadow-sm max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Radio size={18} className={isOpen ? 'text-emerald-500' : 'text-red-500'} />
          <h3>Status: {isOpen ? 'Connected' : 'Disconnected'}</h3>
        </div>

        <div className="flex gap-2 mb-4">
          <InputField
            placeholder="Tulis pesan..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} icon={<Send size={14} />}>
            Kirim
          </Button>
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-md bg-[var(--code-bg)] font-[var(--mono)] text-[0.85rem] max-h-64 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
          {messages.length === 0 && (
            <span className="text-[var(--text-secondary)] opacity-50">Belum ada pesan</span>
          )}
        </div>
      </div>
    </div>
  )
}

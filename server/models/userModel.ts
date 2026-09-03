export interface User {
  id: number
  username: string
  password: string
}

const users: User[] = [
  { id: 1, username: 'admin', password: 'admin123' },
]

export function findUserByCredentials(username?: string, password?: string) {
  return users.find((u) => u.username === username && u.password === password)
}

const API_URL = 'http://localhost:8000'

export interface UserResponse {
  id: number
  username: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface ApiError {
  detail: string
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options)
  if (!res.ok) {
    const body: ApiError = await res.json().catch(() => ({ detail: 'Something went wrong' }))
    throw new Error(body.detail)
  }
  return res.json()
}

export function register(username: string, password: string) {
  return request<UserResponse>('/users/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
}

export function login(username: string, password: string) {
  return request<TokenResponse>('/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
}

export function getProfile(token: string) {
  return request<UserResponse>('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function saveToken(token: string) {
  localStorage.setItem('token', token)
}

export function loadToken(): string | null {
  return localStorage.getItem('token')
}

export function removeToken() {
  localStorage.removeItem('token')
}

import { API_BASE } from './config'

export interface LzgProfile {
  site: {
    name: string
    fullName: string
    chineseName: string
    title: string
    tagline: string
    footer: string
    version: string
  }
  about: {
    eyebrow: string
    heading: string
    body: string
  }
  now: Array<{
    label: string
    value: string
    detail: string
  }>
  contact: {
    heading: string
    message: string
    social: Array<{
      label: string
      url: string
    }>
  }
}

export async function getLzgProfile(): Promise<LzgProfile> {
  const response = await fetch(`${API_BASE}/zongguili/profile`)
  if (!response.ok) throw new Error('Failed to fetch LZG profile')
  return response.json()
}

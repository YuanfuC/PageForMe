import { API_BASE } from './config'

// 数据类型定义
export interface Profile {
  name: string
  title: string
  tagline: string
  bio: string
  terminal: {
    prompt: string
    commands: string[]
    intro: string[]
  }
}

export interface Stat {
  label: string
  value: string
  icon: string
}

export interface Project {
  id: number
  name: string
  description: string
  category: string
  tech: string[]
  link: string
  color: string
}

export interface Skill {
  id: number
  number: string
  title: string
  description: string
  technologies: string[]
  icon: string
}

export interface Social {
  github: string
  email: string
}

export interface Hero {
  name: string
  tagline: string
  emoji: string
  description: string
  birthday: string
  chatInfo: string
  skillInfo: string
  footer: string
  tooltip: string
  link: string
  icons: {
    description: string
    birthday: string
    chat: string
    skill: string
  }
  colors: {
    primary: string
    secondary: string
    glow: string
  }
}

export interface Theme {
  primary: string
  secondary: string
  accent: string
  pink: string
}

export interface Site {
  footer: string
  version: string
  slogan: string
  pet: {
    label: string
    name: string
    emoji: string
    link: string
  }
}

// 通用的 fetch 封装
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`)
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`)
  return res.json()
}

// API 函数
export async function getProfile(): Promise<Profile> {
  return fetchAPI<Profile>('/profile')
}

export async function getStats(): Promise<{ stats: Stat[] }> {
  return fetchAPI<{ stats: Stat[] }>('/stats')
}

export async function getProjects(): Promise<{ projects: Project[] }> {
  return fetchAPI<{ projects: Project[] }>('/projects')
}

export async function getSkills(): Promise<{ skills: Skill[] }> {
  return fetchAPI<{ skills: Skill[] }>('/skills')
}

export async function getSocial(): Promise<Social> {
  return fetchAPI<Social>('/social')
}

export async function getHero(): Promise<Hero> {
  return fetchAPI<Hero>('/hero')
}

export async function getTheme(): Promise<Theme> {
  return fetchAPI<Theme>('/theme')
}

export async function getSite(): Promise<Site> {
  return fetchAPI<Site>('/site')
}

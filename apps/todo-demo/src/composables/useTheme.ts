import { ref, type Ref } from 'vue'

export type Theme = 'light' | 'dark'

export interface UseThemeReturn {
  theme: Ref<Theme>
  toggleTheme: () => void
}

const VALID_THEMES: readonly Theme[] = ['light', 'dark']

function isValidTheme(value: unknown): value is Theme {
  return VALID_THEMES.includes(value as Theme)
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStoredTheme(): Theme | null {
  try {
    return localStorage.getItem('theme')
  } catch {
    return null
  }
}

function writeStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Storage is unavailable; theme lives only in memory via the ref
  }
}

function resolveInitialTheme(): Theme {
  const stored = readStoredTheme()
  if (isValidTheme(stored)) return stored
  const fallback = getSystemTheme()
  writeStoredTheme(fallback)
  return fallback
}

function applyTheme(theme: Theme): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

export function useTheme(): UseThemeReturn {
  const theme = ref<Theme>(resolveInitialTheme())
  applyTheme(theme.value)

  function toggleTheme(): void {
    const nextTheme: Theme = theme.value === 'light' ? 'dark' : 'light'
    theme.value = nextTheme
    applyTheme(nextTheme)
    writeStoredTheme(nextTheme)
  }

  return {
    theme,
    toggleTheme,
  }
}

export function initTheme(): void {
  const theme = resolveInitialTheme()
  applyTheme(theme)
}

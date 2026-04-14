import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme, initTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('should initialize theme to light by default', () => {
    const { theme } = useTheme()
    expect(theme.value).toBe('light')
  })

  it('should toggle theme between light and dark', () => {
    const { theme, toggleTheme } = useTheme()

    toggleTheme()
    expect(theme.value).toBe('dark')

    toggleTheme()
    expect(theme.value).toBe('light')
  })

  it('should persist theme to localStorage when toggled', () => {
    const { toggleTheme } = useTheme()

    toggleTheme()
    expect(localStorage.getItem('theme')).toBe('dark')

    toggleTheme()
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('should read saved theme from localStorage on initialization', () => {
    localStorage.setItem('theme', 'dark')

    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
  })

  it('should fall back to light and overwrite invalid stored theme value', () => {
    localStorage.setItem('theme', 'invalid')

    const { theme } = useTheme()
    expect(theme.value).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('should detect system prefers-color-scheme when no localStorage value exists', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    )

    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
  })

  it('should fall back to light when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined)

    const { theme } = useTheme()
    expect(theme.value).toBe('light')
  })

  it('should silently fall back to in-memory storage when localStorage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage is disabled')
    })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage is disabled')
    })

    const { theme, toggleTheme } = useTheme()
    expect(() => toggleTheme()).not.toThrow()
    expect(theme.value).toBe('dark')
  })

  it('should apply data-theme attribute to html element via initTheme', () => {
    initTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('should apply data-theme="dark" to html element when dark theme is active', () => {
    localStorage.setItem('theme', 'dark')
    initTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('should update data-theme attribute on html element when theme is toggled', () => {
    const { toggleTheme } = useTheme()

    toggleTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    toggleTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})

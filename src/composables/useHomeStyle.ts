import { ref } from 'vue'

export type HomeStyle = 'pretext' | 'minecraft'

const HOME_STYLE_KEY = 'blog-home-style'
const PRETEXT_DARK_KEY = 'pretext-dark-mode'

function readInitialHomeStyle(): HomeStyle {
  if (typeof window === 'undefined') return 'pretext'
  const saved = localStorage.getItem(HOME_STYLE_KEY)
  return saved === 'minecraft' ? 'minecraft' : 'pretext'
}

function readInitialPretextDark(): boolean {
  if (typeof window === 'undefined') return false
  const saved = localStorage.getItem(PRETEXT_DARK_KEY)
  if (saved === 'dark') return true
  if (saved === 'light') return false
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

const homeStyle = ref<HomeStyle>(readInitialHomeStyle())
const pretextDark = ref<boolean>(readInitialPretextDark())

export function useHomeStyle() {
  function setHomeStyle(style: HomeStyle) {
    homeStyle.value = style
    if (typeof window !== 'undefined') {
      localStorage.setItem(HOME_STYLE_KEY, style)
    }
  }

  function togglePretextDark() {
    pretextDark.value = !pretextDark.value
    if (typeof window !== 'undefined') {
      localStorage.setItem(PRETEXT_DARK_KEY, pretextDark.value ? 'dark' : 'light')
    }
  }

  return {
    homeStyle,
    pretextDark,
    setHomeStyle,
    togglePretextDark,
  }
}

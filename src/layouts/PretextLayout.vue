<template>
  <div class="pretext-root" :class="{ 'is-dark': pretextDark }">
    <!-- Header -->
    <header class="pretext-header">
      <nav class="pretext-nav">
        <router-link to="/" class="pretext-brand">
          {{ config.blog.title }}
        </router-link>

        <div class="pretext-nav-right">
          <ul class="pretext-menu">
            <li v-for="item in menuItems" :key="item.to">
              <router-link
                :to="item.to"
                class="pretext-menu-link"
                :class="{ 'is-active': isNavActive(item.activeNames) }"
              >
                {{ item.label }}
              </router-link>
            </li>
          </ul>

          <!-- Dark / Light Mode Toggle -->
          <button
            id="dark-mode-toggle"
            class="pretext-icon-btn"
            :aria-label="pretextDark ? 'Switch to light mode' : 'Switch to dark mode'"
            :title="pretextDark ? '切换浅色模式' : '切换深色模式'"
            @click="togglePretextDark"
          >
            <svg v-if="!pretextDark" class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          <!-- Switch to Minecraft Theme Button (right of dark/light toggle) -->
          <button
            id="minecraft-mode-toggle"
            class="pretext-icon-btn pretext-mc-btn"
            aria-label="切换至 Minecraft 风格主题"
            title="切换至 Minecraft 风格主题"
            @click="switchToMinecraft"
          >
            <svg class="icon-svg" viewBox="0 0 16 16" fill="none" shape-rendering="crispEdges">
              <rect x="2" y="2" width="12" height="12" fill="#8B5A2B" />
              <rect x="2" y="2" width="12" height="4" fill="#5D9E3F" />
              <rect x="2" y="6" width="3" height="2" fill="#5D9E3F" />
              <rect x="7" y="6" width="2" height="2" fill="#5D9E3F" />
              <rect x="11" y="6" width="3" height="2" fill="#5D9E3F" />
              <rect x="4" y="9" width="2" height="2" fill="#6F4520" />
              <rect x="10" y="10" width="2" height="2" fill="#6F4520" />
              <rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="1" />
            </svg>
          </button>

          <!-- Mobile menu button -->
          <button
            class="pretext-mobile-btn"
            aria-label="Menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="icon-svg-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile menu dropdown -->
      <div v-if="mobileMenuOpen" class="pretext-mobile-menu">
        <ul>
          <li v-for="item in menuItems" :key="item.to">
            <router-link
              :to="item.to"
              class="pretext-mobile-link"
              :class="{ 'is-active': isNavActive(item.activeNames) }"
              @click="mobileMenuOpen = false"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </div>
    </header>

    <!-- Main content -->
    <main class="pretext-main" :class="{ 'is-home': route.name === 'home' }">
      <PretextHomeView v-if="route.name === 'home'" />
      <PretextArchivesView v-else-if="route.name === 'articles'" />
      <PretextArticleView v-else-if="route.name === 'article-detail'" />
      <PretextProjectsView v-else-if="route.name === 'projects'" />
      <PretextToolsView v-else-if="route.name === 'tools'" />
      <PretextAboutView v-else-if="route.name === 'about'" />
      <div v-else class="pretext-fallback-view">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer class="pretext-footer">
      <div class="pretext-footer-inner">
        <p>&copy; {{ currentYear }} {{ config.blog.author }}</p>
        <p class="footer-sub">
          Powered by
          <a href="https://vuejs.org" target="_blank" rel="noopener">Vue 3</a>
          &middot;
          Theme
          <a href="https://github.com/YingmuZ/hexo-theme-pretext-with-ascii-bunny" target="_blank" rel="noopener">Pretext</a>
        </p>
        <div class="footer-socials">
          <a
            :href="`https://github.com/${config.github.owner}`"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
            class="social-link"
          >
            <svg class="icon-svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            v-if="config.blog.email"
            :href="`mailto:${config.blog.email}`"
            aria-label="Email"
            class="social-link"
          >
            <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHomeStyle } from '@/composables/useHomeStyle'
import { config } from '@/config'
import PretextHomeView from '@/views/PretextHomeView.vue'
import PretextArchivesView from '@/views/pretext/PretextArchivesView.vue'
import PretextArticleView from '@/views/pretext/PretextArticleView.vue'
import PretextProjectsView from '@/views/pretext/PretextProjectsView.vue'
import PretextToolsView from '@/views/pretext/PretextToolsView.vue'
import PretextAboutView from '@/views/pretext/PretextAboutView.vue'

const route = useRoute()
const { pretextDark, togglePretextDark, setHomeStyle } = useHomeStyle()

const mobileMenuOpen = ref(false)
const currentYear = new Date().getFullYear()

const menuItems = [
  { label: 'Home', to: '/', activeNames: ['home'] },
  { label: 'Archives', to: '/articles', activeNames: ['articles', 'article-detail'] },
  { label: 'Projects', to: '/projects', activeNames: ['projects', 'commits', 'releases', 'release-detail'] },
  { label: 'Tools', to: '/tools', activeNames: ['tools', 'tool-detail'] },
  { label: 'About', to: '/about', activeNames: ['about'] },
]

function isNavActive(activeNames: string[]): boolean {
  return activeNames.includes(String(route.name || ''))
}

function switchToMinecraft() {
  setHomeStyle('minecraft')
}

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false
  },
)
</script>

<style scoped>
.pretext-root {
  --pt-bg: #fafaf8;
  --pt-bg-subtle: #f3f2ee;
  --pt-text: #1a1a1a;
  --pt-secondary: #6b6b6b;
  --pt-accent: #3acce8;
  --pt-border: #e8e6e3;

  /* Bridge global CSS variables so embedded shared views (e.g. ToolDetailView) match Pretext */
  --bg-primary: var(--pt-bg);
  --bg-secondary: var(--pt-bg-subtle);
  --bg-card: var(--pt-bg);
  --text-primary: var(--pt-text);
  --text-secondary: var(--pt-secondary);
  --accent: var(--pt-accent);
  --border: var(--pt-border);
  --shadow: rgba(0, 0, 0, 0.04);
  --pxc: none;
  --pxc-circle: none;
  --pxc-circle-in: none;
  --px-frame: none;
  --px-frame-accent-faint: none;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--pt-bg);
  color: var(--pt-text);
  font-family: 'Noto Serif JP', 'Noto Serif SC', Georgia, serif;
  line-height: 1.8;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.pretext-root.is-dark {
  --pt-bg: #121212;
  --pt-bg-subtle: #1a1a1a;
  --pt-text: #e0ded8;
  --pt-secondary: #8a8a8a;
  --pt-accent: #e8563a;
  --pt-border: #2a2a2a;
  --shadow: rgba(0, 0, 0, 0.3);
}

/* Header */
.pretext-header {
  width: 100%;
  border-bottom: 1px solid var(--pt-border);
}

.pretext-nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pretext-brand {
  font-family: 'Shippori Mincho', 'Noto Serif JP', 'Noto Serif SC', serif;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--pt-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

.pretext-brand:hover {
  color: var(--pt-accent);
}

.pretext-nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pretext-menu {
  display: flex;
  align-items: center;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
}

.pretext-menu-link {
  color: var(--pt-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.pretext-menu-link:hover,
.pretext-menu-link.is-active {
  color: var(--pt-accent);
}

.pretext-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  background: transparent;
  color: var(--pt-secondary);
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}

.pretext-icon-btn:hover {
  color: var(--pt-accent);
  background-color: color-mix(in srgb, var(--pt-accent) 10%, transparent);
}

.pretext-mc-btn:hover {
  transform: translateY(-1px);
}

.icon-svg {
  width: 20px;
  height: 20px;
  display: block;
}

.icon-svg-lg {
  width: 24px;
  height: 24px;
  display: block;
}

.pretext-mobile-btn {
  display: none;
  padding: 4px;
  border: none;
  background: transparent;
  color: var(--pt-secondary);
  cursor: pointer;
}

.pretext-mobile-menu {
  border-top: 1px solid var(--pt-border);
  padding: 12px 24px;
}

.pretext-mobile-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pretext-mobile-link {
  display: block;
  padding: 4px 0;
  font-size: 0.9rem;
  color: var(--pt-secondary);
  text-decoration: none;
}

.pretext-mobile-link:hover,
.pretext-mobile-link.is-active {
  color: var(--pt-accent);
}

/* Main */
.pretext-main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  box-sizing: border-box;
}

.pretext-main.is-home {
  display: flex;
  align-items: center;
}

.pretext-fallback-view {
  width: 100%;
}

/* Footer */
.pretext-footer {
  width: 100%;
  border-top: 1px solid var(--pt-border);
  margin-top: auto;
}

.pretext-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--pt-secondary);
}

.pretext-footer-inner p {
  margin: 0;
}

.footer-sub {
  margin-top: 4px !important;
}

.footer-sub a {
  color: var(--pt-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-sub a:hover {
  color: var(--pt-accent);
}

.footer-socials {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.social-link {
  color: var(--pt-secondary);
  transition: color 0.2s ease;
}

.social-link:hover {
  color: var(--pt-accent);
}

@media (max-width: 960px) {
  .pretext-main {
    padding: 28px 16px;
  }
}

@media (max-width: 640px) {
  .pretext-menu {
    display: none;
  }

  .pretext-mobile-btn {
    display: inline-flex;
  }

  .pretext-nav-right {
    gap: 10px;
  }
}
</style>

<template>
  <div class="pretext-hero-grid">
    <!-- Left (desktop) / Bottom (mobile): Terminal-framed Recent Posts -->
    <div class="pretext-posts-col">
      <div class="terminal-box">
        <div class="terminal-label-top">&#x250C;&#x2500; recent posts &#x2500;&#x2510;</div>

        <div class="terminal-inner">
          <ul v-if="recentPosts.length > 0" class="post-list">
            <li
              v-for="(article, idx) in recentPosts"
              :key="article.slug"
              class="post-item"
            >
              <router-link
                :to="`/article/${encodeURIComponent(article.slug)}`"
                class="post-link"
                :class="{ 'has-border': idx < recentPosts.length - 1 }"
              >
                <div class="post-row">
                  <span class="post-arrow">&gt;</span>
                  <div class="post-body">
                    <div class="post-meta">
                      <time class="post-date" :datetime="article.date">
                        {{ formatDate(article.date) }}
                      </time>
                      <template v-if="article.tags && article.tags.length">
                        <span class="post-sep">&#x2502;</span>
                        <span class="post-cat">{{ article.tags[0] }}</span>
                      </template>
                    </div>
                    <h2 class="post-title">
                      {{ article.title || 'Untitled' }}
                    </h2>
                    <p v-if="article.description" class="post-excerpt">
                      {{ article.description }}
                    </p>
                    <div v-if="article.tags && article.tags.length" class="post-tags">
                      <span v-for="tag in article.tags" :key="tag" class="post-tag">
                        #{{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>

          <div v-else class="post-empty">
            <span>&gt;</span> 暂无文章
          </div>

          <div class="terminal-footer-link">
            <router-link to="/articles" class="archives-link">
              <span>&gt;</span>
              <span>view all archives &rarr;</span>
            </router-link>
          </div>
        </div>

        <div class="terminal-label-bottom">&#x2514;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2518;</div>
      </div>
    </div>

    <!-- Right (desktop) / Top (mobile): Animated ASCII Bunny Hero -->
    <div class="pretext-bunny-col">
      <PretextBunnyHero :dark="pretextDark" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useArticles } from '@/composables/useArticles'
import { useHomeStyle } from '@/composables/useHomeStyle'
import { usePageSeo } from '@/composables/useSeo'
import { config } from '@/config'
import PretextBunnyHero from '@/components/pretext/PretextBunnyHero.vue'

const { t } = useI18n()
const store = useAppStore()
const { fetchArticles } = useArticles()
const { pretextDark } = useHomeStyle()

usePageSeo(
  computed(() => config.blog.title),
  computed(() => t('seo.home')),
  '/',
)

const recentPosts = computed(() => store.articles.slice(0, 5))

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr.slice(0, 10)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

onMounted(() => {
  if (store.articles.length === 0) {
    fetchArticles()
  }
})
</script>

<style scoped>
.pretext-hero-grid {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
}

.pretext-posts-col {
  flex: 0 0 50%;
  min-width: 0;
  padding: 16px 0;
}

.pretext-bunny-col {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.terminal-box {
  position: relative;
  border: 1px dashed var(--pt-border);
  border-radius: 2px;
}

.terminal-label-top {
  position: absolute;
  top: -12px;
  left: 16px;
  padding: 0 8px;
  background-color: var(--pt-bg);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--pt-secondary);
  transition: background-color 0.25s ease;
}

.terminal-label-bottom {
  position: absolute;
  bottom: -12px;
  right: 16px;
  padding: 0 8px;
  background-color: var(--pt-bg);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--pt-secondary);
  transition: background-color 0.25s ease;
}

.terminal-inner {
  padding: 26px 22px 18px;
}

.post-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.post-link {
  display: block;
  padding: 12px 0;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease;
}

.post-link.has-border {
  border-bottom: 1px dotted var(--pt-border);
}

.post-link:hover {
  border-bottom-color: var(--pt-accent);
}

.post-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.post-arrow {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--pt-secondary);
  margin-top: 2px;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.post-link:hover .post-arrow,
.post-link:hover .post-title {
  color: var(--pt-accent);
}

.post-body {
  flex: 1;
  min-width: 0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
  color: var(--pt-secondary);
  font-variant-numeric: tabular-nums;
}

.post-sep {
  opacity: 0.4;
}

.post-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.45;
  color: var(--pt-text);
  transition: color 0.2s ease;
}

.post-excerpt {
  margin: 4px 0 0;
  font-size: 0.78rem;
  color: var(--pt-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.post-tag {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 10px;
  color: var(--pt-secondary);
  opacity: 0.55;
}

.post-empty {
  padding: 20px 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  color: var(--pt-secondary);
}

.terminal-footer-link {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--pt-border);
}

.archives-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
  color: var(--pt-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.archives-link:hover {
  color: var(--pt-accent);
}

@media (max-width: 960px) {
  .pretext-hero-grid {
    flex-direction: column-reverse;
    gap: 24px;
  }

  .pretext-posts-col,
  .pretext-bunny-col {
    flex: none;
    width: 100%;
  }
}
</style>

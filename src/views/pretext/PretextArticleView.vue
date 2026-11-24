<template>
  <article class="pt-article-page">
    <div class="pt-back-bar">
      <router-link to="/articles" class="pt-back-link">
        &larr; back to archives
      </router-link>
    </div>

    <template v-if="article">
      <header class="pt-article-header">
        <h1 class="pt-article-title">{{ article.title }}</h1>
        <div class="pt-article-meta">
          <time :datetime="article.date">{{ formatDate(article.date) }}</time>
          <template v-if="article.readingTime">
            <span class="pt-dot">&middot;</span>
            <span>约 {{ article.readingTime }} 分钟阅读</span>
          </template>
        </div>
        <div v-if="article.tags && article.tags.length" class="pt-article-tags">
          <span v-for="tag in article.tags" :key="tag" class="pt-tag">#{{ tag }}</span>
        </div>
      </header>

      <div v-if="loadingHtml" class="pt-loading">&gt; loading content...</div>
      <div v-else class="pt-prose" v-html="renderedHtml" />

      <div class="pt-article-footer">
        <div id="pretext-gitalk-container" class="pt-gitalk" />
      </div>
    </template>

    <div v-else-if="!loadingArticles" class="pt-not-found">
      <p>&gt; Article not found.</p>
      <router-link to="/articles" class="pt-back-link">&larr; return to archives</router-link>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useArticles, loadArticleHtml } from '@/composables/useArticles'
import { useArticleSeo } from '@/composables/useSeo'
import { useGitalk } from '@/composables/useGitalk'

const route = useRoute()
const store = useAppStore()
const { fetchArticles, loading: loadingArticles } = useArticles()

const slug = computed(() => {
  const raw = route.params.slug
  const str = Array.isArray(raw) ? raw[0] : raw || ''
  try {
    return decodeURIComponent(str)
  } catch {
    return str
  }
})

const article = computed(() => store.articles.find((a) => a.slug === slug.value) || null)
const renderedHtml = ref('')
const loadingHtml = ref(false)

useArticleSeo(article)

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr.slice(0, 10)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function loadCurrentArticle() {
  if (store.articles.length === 0) {
    await fetchArticles()
  }
  const current = article.value
  if (!current) {
    renderedHtml.value = ''
    return
  }
  loadingHtml.value = true
  try {
    renderedHtml.value = current.html || (await loadArticleHtml(current.slug))
  } finally {
    loadingHtml.value = false
  }
  await nextTick()
  const { init } = useGitalk('pretext-gitalk-container', current.slug, current.title)
  init()
}

watch(slug, () => {
  loadCurrentArticle()
})

onMounted(() => {
  loadCurrentArticle()
})
</script>

<style scoped>
.pt-article-page {
  max-width: 720px;
  margin: 0 auto;
}

.pt-back-bar {
  margin-bottom: 24px;
}

.pt-back-link {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  color: var(--pt-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.pt-back-link:hover {
  color: var(--pt-accent);
}

.pt-article-header {
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px dashed var(--pt-border);
}

.pt-article-title {
  margin: 0 0 12px;
  font-family: 'Shippori Mincho', 'Noto Serif JP', 'Noto Serif SC', serif;
  font-size: 1.85rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--pt-text);
}

.pt-article-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  color: var(--pt-secondary);
}

.pt-article-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pt-tag {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--pt-secondary);
  opacity: 0.8;
}

.pt-loading,
.pt-not-found {
  padding: 32px 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  color: var(--pt-secondary);
}

.pt-prose {
  font-size: 1rem;
  line-height: 1.85;
  color: var(--pt-text);
  word-break: break-word;
}

.pt-prose :deep(h1),
.pt-prose :deep(h2),
.pt-prose :deep(h3),
.pt-prose :deep(h4) {
  font-family: 'Shippori Mincho', 'Noto Serif JP', 'Noto Serif SC', serif;
  margin-top: 1.8em;
  margin-bottom: 0.7em;
  color: var(--pt-text);
  font-weight: 600;
}

.pt-prose :deep(p) {
  margin: 0 0 1.35em;
}

.pt-prose :deep(a) {
  color: var(--pt-accent);
  text-decoration: none;
}

.pt-prose :deep(a:hover) {
  text-decoration: underline;
}

.pt-prose :deep(blockquote) {
  margin: 1.4em 0;
  padding: 0.2em 0 0.2em 1em;
  border-left: 3px solid var(--pt-accent);
  color: var(--pt-secondary);
}

.pt-prose :deep(pre) {
  margin: 1.4em 0;
  padding: 14px 16px;
  overflow-x: auto;
  background-color: var(--pt-bg-subtle);
  border: 1px solid var(--pt-border);
  border-radius: 3px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
}

.pt-prose :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.88em;
}

.pt-prose :deep(:not(pre) > code) {
  padding: 2px 5px;
  background-color: var(--pt-bg-subtle);
  border: 1px solid var(--pt-border);
  border-radius: 3px;
}

.pt-prose :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 3px;
}

.pt-prose :deep(ul),
.pt-prose :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 1.35em;
}

.pt-prose :deep(hr) {
  border: none;
  border-top: 1px dashed var(--pt-border);
  margin: 2em 0;
}

.pt-article-footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px dashed var(--pt-border);
}
</style>

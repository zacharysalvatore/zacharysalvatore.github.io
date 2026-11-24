<template>
  <div class="pt-page">
    <header class="pt-page-header">
      <div class="pt-eyebrow">&#x250C;&#x2500; archives &#x2500;&#x2510;</div>
      <h1 class="pt-page-title">Archives</h1>
      <p class="pt-page-subtitle">共 {{ filteredArticles.length }} 篇文章</p>
    </header>

    <!-- Search & Tag Filter -->
    <div class="pt-controls">
      <input
        v-model.trim="keyword"
        type="text"
        class="pt-search-input"
        placeholder="> 搜索文章标题、描述或标签..."
      />
      <div v-if="allTags.length > 0" class="pt-tag-bar">
        <button
          type="button"
          class="pt-tag-btn"
          :class="{ active: selectedTag === '' }"
          @click="selectedTag = ''"
        >
          all
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          type="button"
          class="pt-tag-btn"
          :class="{ active: selectedTag === tag }"
          @click="selectedTag = selectedTag === tag ? '' : tag"
        >
          #{{ tag }}
        </button>
      </div>
    </div>

    <!-- Year-grouped archive list -->
    <div v-if="groupedByYear.length > 0" class="pt-archive-groups">
      <section v-for="group in groupedByYear" :key="group.year" class="pt-year-group">
        <h2 class="pt-year-heading">
          <span>{{ group.year }}</span>
          <span class="pt-year-count">{{ group.items.length }}</span>
        </h2>

        <ul class="pt-archive-list">
          <li v-for="article in group.items" :key="article.slug" class="pt-archive-item">
            <router-link :to="`/article/${encodeURIComponent(article.slug)}`" class="pt-archive-link">
              <div class="pt-archive-row">
                <time class="pt-archive-date" :datetime="article.date">{{ formatShortDate(article.date) }}</time>
                <div class="pt-archive-info">
                  <h3 class="pt-archive-title">{{ article.title || 'Untitled' }}</h3>
                  <p v-if="article.description" class="pt-archive-desc">{{ article.description }}</p>
                  <div v-if="article.tags && article.tags.length" class="pt-archive-tags">
                    <span v-for="tag in article.tags" :key="tag">#{{ tag }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </section>
    </div>

    <div v-else class="pt-empty">
      <span>&gt;</span> 没有找到匹配的文章
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useArticles } from '@/composables/useArticles'
import { usePageSeo } from '@/composables/useSeo'
import type { Article } from '@/types/article'

const { t } = useI18n()
const store = useAppStore()
const { fetchArticles } = useArticles()

usePageSeo(
  computed(() => t('pageTitle.articles')),
  computed(() => t('seo.articles')),
  '/articles',
)

const keyword = ref('')
const selectedTag = ref('')

const allTags = computed(() => {
  const set = new Set<string>()
  for (const a of store.articles) {
    for (const tag of a.tags || []) set.add(tag)
  }
  return [...set]
})

const filteredArticles = computed(() => {
  const kw = keyword.value.toLowerCase()
  return store.articles.filter((a) => {
    if (selectedTag.value && !(a.tags || []).includes(selectedTag.value)) return false
    if (!kw) return true
    return (
      a.title.toLowerCase().includes(kw) ||
      (a.description || '').toLowerCase().includes(kw) ||
      (a.tags || []).some((tag) => tag.toLowerCase().includes(kw))
    )
  })
})

const groupedByYear = computed(() => {
  const map = new Map<string, Article[]>()
  for (const a of filteredArticles.value) {
    const d = new Date(a.date)
    const year = Number.isNaN(d.getTime()) ? 'Unknown' : String(d.getFullYear())
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(a)
  }
  return [...map.entries()].map(([year, items]) => ({ year, items }))
})

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr.slice(0, 10)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${m}-${day}`
}

onMounted(() => {
  if (store.articles.length === 0) fetchArticles()
})
</script>

<style scoped>
.pt-page {
  max-width: 720px;
  margin: 0 auto;
}

.pt-page-header {
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--pt-border);
}

.pt-eyebrow {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--pt-secondary);
  margin-bottom: 6px;
}

.pt-page-title {
  margin: 0;
  font-family: 'Shippori Mincho', 'Noto Serif JP', 'Noto Serif SC', serif;
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--pt-text);
}

.pt-page-subtitle {
  margin: 4px 0 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  color: var(--pt-secondary);
}

.pt-controls {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pt-search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 14px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  color: var(--pt-text);
  background: transparent;
  border: 1px dashed var(--pt-border);
  border-radius: 2px;
  outline: none;
  transition: border-color 0.2s ease;
}

.pt-search-input:focus {
  border-color: var(--pt-accent);
}

.pt-tag-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pt-tag-btn {
  padding: 3px 10px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--pt-secondary);
  background: transparent;
  border: 1px solid var(--pt-border);
  border-radius: 2px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.pt-tag-btn:hover,
.pt-tag-btn.active {
  color: var(--pt-accent);
  border-color: var(--pt-accent);
}

.pt-year-group {
  margin-bottom: 32px;
}

.pt-year-heading {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0 0 12px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--pt-text);
}

.pt-year-count {
  font-size: 0.75rem;
  color: var(--pt-secondary);
}

.pt-archive-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pt-archive-link {
  display: block;
  padding: 14px 0;
  border-bottom: 1px dotted var(--pt-border);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease;
}

.pt-archive-link:hover {
  border-bottom-color: var(--pt-accent);
}

.pt-archive-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.pt-archive-date {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  color: var(--pt-secondary);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  margin-top: 3px;
}

.pt-archive-info {
  flex: 1;
  min-width: 0;
}

.pt-archive-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--pt-text);
  transition: color 0.2s ease;
}

.pt-archive-link:hover .pt-archive-title {
  color: var(--pt-accent);
}

.pt-archive-desc {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: var(--pt-secondary);
  line-height: 1.6;
}

.pt-archive-tags {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.72rem;
  color: var(--pt-secondary);
  opacity: 0.7;
}

.pt-empty {
  padding: 32px 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  color: var(--pt-secondary);
}
</style>

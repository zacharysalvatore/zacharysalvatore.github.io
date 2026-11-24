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
      <div v-else class="pt-prose" v-html="enhancedHtml" @click="handleProseClick" />

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

/** 将 highlight.js 生成的 HTML 按行拆分，同时保持跨行 <span> 标签正确闭合与重开 */
function splitHighlightedHtmlLines(html: string): string[] {
  const normalized = html.endsWith('\n') ? html.slice(0, -1) : html
  if (!normalized) return ['']

  const openTags: string[] = []
  const lines: string[] = []
  let current = ''
  const tokenRe = /(<\/?span\b[^>]*>|\r?\n)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = tokenRe.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      current += normalized.slice(lastIndex, match.index)
    }
    const token = match[0]
    if (token === '\n' || token === '\r\n') {
      current += '</span>'.repeat(openTags.length)
      lines.push(current)
      current = openTags.join('')
    } else if (token.startsWith('</')) {
      if (openTags.length > 0) openTags.pop()
      current += token
    } else {
      openTags.push(token)
      current += token
    }
    lastIndex = tokenRe.lastIndex
  }

  if (lastIndex < normalized.length) {
    current += normalized.slice(lastIndex)
  }
  current += '</span>'.repeat(openTags.length)
  lines.push(current)

  return lines
}

/** 为 Pretext（bunny）主题下的代码块组装 Mac 窗口标题栏与行号表 */
const enhancedHtml = computed(() => {
  const rawHtml = renderedHtml.value
  if (!rawHtml || typeof document === 'undefined') return rawHtml

  const tpl = document.createElement('template')
  tpl.innerHTML = rawHtml

  tpl.content.querySelectorAll<HTMLElement>('.code-block-wrapper').forEach((wrapper) => {
    const langEl = wrapper.querySelector<HTMLElement>('.code-lang')
    const copyBtn = wrapper.querySelector<HTMLElement>('.code-copy-btn')
    const preEl = wrapper.querySelector<HTMLElement>('pre')
    const codeEl = preEl?.querySelector<HTMLElement>('code')
    if (!preEl || !codeEl) return

    const header = document.createElement('div')
    header.className = 'pt-code-header'

    const dots = document.createElement('span')
    dots.className = 'pt-code-dots'
    dots.setAttribute('aria-hidden', 'true')
    header.appendChild(dots)

    if (langEl) {
      header.appendChild(langEl)
    } else {
      const fallbackLang = document.createElement('span')
      fallbackLang.className = 'code-lang'
      fallbackLang.textContent = 'text'
      header.appendChild(fallbackLang)
    }

    if (copyBtn) {
      header.appendChild(copyBtn)
    }

    wrapper.insertBefore(header, preEl)

    const lines = splitHighlightedHtmlLines(codeEl.innerHTML)
    codeEl.classList.add('pt-code-table')
    codeEl.innerHTML = lines
      .map(
        (lineHtml, idx) =>
          `<span class="pt-code-row"><span class="pt-code-ln" aria-hidden="true">${idx + 1}</span><span class="pt-code-src">${lineHtml}</span></span>`,
      )
      .join('')
  })

  return tpl.innerHTML
})

async function handleProseClick(e: Event) {
  const btn = (e.target as HTMLElement).closest('.code-copy-btn') as HTMLElement | null
  if (!btn) return
  const b64 = btn.dataset.codeB64
  if (!b64) return
  const code = decodeURIComponent(escape(atob(b64)))
  try {
    await navigator.clipboard.writeText(code)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = code
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  btn.textContent = '已复制'
  btn.classList.add('copied')
  setTimeout(() => {
    btn.textContent = '复制'
    btn.classList.remove('copied')
  }, 1500)
}

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
  border-radius: 10px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
}

/* Mac 窗口风格代码块（配色沿用当前 Pretext 主题与 highlight.js 方案） */
.pt-prose :deep(.code-block-wrapper) {
  position: relative;
  margin: 1.4em 0;
  max-width: 100%;
  min-width: 0;
  overflow-x: clip;
  overflow-y: hidden;
  background-color: var(--pt-bg-subtle);
  color: var(--pt-text);
  border: 1px solid var(--pt-border);
  border-radius: 10px;
  box-shadow:
    0 1px 2px color-mix(in srgb, var(--pt-text) 6%, transparent),
    0 0 0 1px color-mix(in srgb, var(--pt-border) 40%, transparent);
}

.pt-prose :deep(.pt-code-header) {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  padding: 0.42rem 0.55rem 0.42rem 0.85rem;
  border-bottom: 1px solid color-mix(in srgb, var(--pt-border) 85%, transparent);
  background: color-mix(in srgb, var(--pt-bg-subtle) 65%, var(--pt-border));
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.pt-prose :deep(.pt-code-dots) {
  display: inline-flex;
  flex-shrink: 0;
  width: 52px;
  height: 10px;
  opacity: 0.9;
  background-image:
    radial-gradient(circle closest-side, #ff5f56 90%, transparent),
    radial-gradient(circle closest-side, #ffbd2e 90%, transparent),
    radial-gradient(circle closest-side, #27c93f 90%, transparent);
  background-repeat: no-repeat;
  background-size: 10px 10px;
  background-position: 0 50%, 18px 50%, 36px 50%;
}

.pt-prose :deep(.pt-code-header .code-lang) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.72rem;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--pt-secondary);
  opacity: 0.9;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pt-prose :deep(.pt-code-header .code-copy-btn) {
  margin-left: auto;
  flex-shrink: 0;
  appearance: none;
  padding: 0.36rem 0.65rem;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--pt-border) 85%, transparent);
  background: color-mix(in srgb, var(--pt-bg) 92%, transparent);
  color: var(--pt-text);
  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1;
  font-weight: 500;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--pt-text) 6%, transparent);
  transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}

.pt-prose :deep(.pt-code-header .code-copy-btn:hover) {
  border-color: var(--pt-accent);
  color: var(--pt-accent);
}

.pt-prose :deep(.pt-code-header .code-copy-btn.copied) {
  border-color: var(--pt-accent);
  background: color-mix(in srgb, var(--pt-accent) 12%, var(--pt-bg));
  color: var(--pt-accent);
}

.pt-prose :deep(.code-block-wrapper pre) {
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  overflow-x: auto;
  overflow-y: hidden;
}

.pt-prose :deep(.code-block-wrapper pre > code.pt-code-table) {
  display: table;
  width: max-content;
  min-width: 100%;
  padding: 0.65rem 0 0.85rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.55;
  white-space: pre;
  background: transparent;
  color: var(--pt-text);
}

.pt-prose :deep(.pt-code-row) {
  display: table-row;
}

.pt-prose :deep(.pt-code-ln) {
  display: table-cell;
  width: 1px;
  min-width: 2.4em;
  padding: 0 0.75rem 0 0.9rem;
  border-right: 1px solid color-mix(in srgb, var(--pt-border) 80%, transparent);
  text-align: right;
  vertical-align: top;
  white-space: nowrap;
  user-select: none;
  opacity: 0.42;
  font-variant-numeric: tabular-nums;
  line-height: 1.55;
  color: var(--pt-secondary);
}

.pt-prose :deep(.pt-code-src) {
  display: table-cell;
  vertical-align: top;
  padding-left: 0.75rem;
  padding-right: 1rem;
  white-space: pre;
  line-height: 1.55;
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

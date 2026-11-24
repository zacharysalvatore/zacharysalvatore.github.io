<template>
  <div class="pt-page">
    <header class="pt-page-header">
      <div class="pt-eyebrow">&#x250C;&#x2500; tools &#x2500;&#x2510;</div>
      <h1 class="pt-page-title">Tools</h1>
      <p class="pt-page-subtitle">纯前端在线开发工具箱（共 {{ filteredTools.length }} 个）</p>
    </header>

    <div class="pt-controls">
      <input
        v-model.trim="keyword"
        type="text"
        class="pt-search-input"
        placeholder="> 搜索工具名称、描述或标签..."
      />
    </div>

    <div v-if="filteredTools.length > 0" class="pt-tools-grid">
      <router-link
        v-for="tool in filteredTools"
        :key="tool.key"
        :to="`/tools/${tool.key}/`"
        class="pt-tool-card"
      >
        <div class="pt-tool-head">
          <span class="pt-tool-icon">{{ tool.icon }}</span>
          <h2 class="pt-tool-name">{{ tool.name }}</h2>
        </div>
        <p class="pt-tool-desc">{{ tool.description }}</p>
        <div v-if="tool.tags.length" class="pt-tool-tags">
          <span v-for="tag in tool.tags" :key="tag">#{{ tag }}</span>
        </div>
      </router-link>
    </div>

    <div v-else class="pt-empty">
      <span>&gt;</span> 没有找到匹配的工具
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { toolKeys } from '@/data/tools'
import { usePageSeo } from '@/composables/useSeo'

const { t, tm } = useI18n()

usePageSeo(
  computed(() => t('pageTitle.tools')),
  computed(() => t('seo.tools')),
  '/tools',
)

const keyword = ref('')

const tools = computed(() =>
  toolKeys.map((item) => {
    const rawTags = (tm as (key: string) => unknown)(`tools.${item.key}Tags`)
    const tags: string[] = Array.isArray(rawTags) ? rawTags.map((v) => String(v)) : []
    return {
      key: item.key,
      icon: item.icon,
      name: t(`tools.${item.key}Name`),
      description: t(`tools.${item.key}Desc`),
      tags,
    }
  }),
)

const filteredTools = computed(() => {
  const kw = keyword.value.toLowerCase()
  if (!kw) return tools.value
  return tools.value.filter(
    (tool) =>
      tool.name.toLowerCase().includes(kw) ||
      tool.description.toLowerCase().includes(kw) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(kw)),
  )
})
</script>

<style scoped>
.pt-page {
  max-width: 960px;
  margin: 0 auto;
}

.pt-page-header {
  margin-bottom: 24px;
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
  margin-bottom: 24px;
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

.pt-tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.pt-tool-card {
  display: flex;
  flex-direction: column;
  padding: 16px 18px;
  border: 1px dashed var(--pt-border);
  border-radius: 2px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.pt-tool-card:hover {
  border-color: var(--pt-accent);
  transform: translateY(-2px);
}

.pt-tool-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.pt-tool-icon {
  font-size: 1.05rem;
}

.pt-tool-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--pt-text);
  transition: color 0.2s ease;
}

.pt-tool-card:hover .pt-tool-name {
  color: var(--pt-accent);
}

.pt-tool-desc {
  margin: 0 0 10px;
  font-size: 0.8rem;
  color: var(--pt-secondary);
  line-height: 1.6;
  flex: 1;
}

.pt-tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.7rem;
  color: var(--pt-secondary);
  opacity: 0.75;
}

.pt-empty {
  padding: 32px 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  color: var(--pt-secondary);
}
</style>

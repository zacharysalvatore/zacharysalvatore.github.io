<template>
  <div class="pt-page">
    <header class="pt-page-header">
      <div class="pt-eyebrow">&#x250C;&#x2500; projects &#x2500;&#x2510;</div>
      <h1 class="pt-page-title">Projects</h1>
      <p class="pt-page-subtitle">开源项目与正在构建的作品</p>
    </header>

    <div class="pt-categories">
      <section v-for="category in categories" :key="category.key" class="pt-category">
        <h2 class="pt-category-title">
          <span>{{ category.icon }}</span>
          <span>{{ $t(category.label) }}</span>
        </h2>

        <div class="pt-project-grid">
          <a
            v-for="project in category.projects"
            :key="project.name"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="pt-project-card"
          >
            <div class="pt-project-top">
              <span class="pt-project-name">&gt; {{ project.name }}</span>
              <span class="pt-project-arrow">&nearr;</span>
            </div>
            <p class="pt-project-desc">{{ project.description }}</p>
            <div v-if="project.tech.length" class="pt-project-tech">
              <span v-for="tech in project.tech" :key="tech" class="pt-tech-tag">#{{ tech }}</span>
            </div>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { categories } from '@/data/projects'
import { usePageSeo } from '@/composables/useSeo'

const { t } = useI18n()

usePageSeo(
  computed(() => t('pageTitle.projects')),
  computed(() => t('seo.projects')),
  '/projects',
)
</script>

<style scoped>
.pt-page {
  max-width: 860px;
  margin: 0 auto;
}

.pt-page-header {
  margin-bottom: 32px;
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

.pt-category {
  margin-bottom: 36px;
}

.pt-category-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--pt-text);
}

.pt-project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.pt-project-card {
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border: 1px dashed var(--pt-border);
  border-radius: 2px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.pt-project-card:hover {
  border-color: var(--pt-accent);
  transform: translateY(-2px);
}

.pt-project-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.pt-project-name {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--pt-text);
  transition: color 0.2s ease;
}

.pt-project-arrow {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  color: var(--pt-secondary);
  transition: color 0.2s ease;
}

.pt-project-card:hover .pt-project-name,
.pt-project-card:hover .pt-project-arrow {
  color: var(--pt-accent);
}

.pt-project-desc {
  margin: 0 0 12px;
  font-size: 0.84rem;
  color: var(--pt-secondary);
  line-height: 1.65;
  flex: 1;
}

.pt-project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pt-tech-tag {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.72rem;
  color: var(--pt-secondary);
  opacity: 0.75;
}
</style>

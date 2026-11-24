<template>
  <div class="pt-page">
    <header class="pt-page-header">
      <div class="pt-eyebrow">&#x250C;&#x2500; about &#x2500;&#x2510;</div>
      <div class="pt-profile">
        <img :src="config.blog.avatar" :alt="config.blog.title" class="pt-avatar" />
        <div class="pt-profile-info">
          <h1 class="pt-page-title">{{ config.blog.title }}</h1>
          <p class="pt-bio">{{ $t('about.bio') }}</p>
          <div class="pt-tags">
            <span v-for="tag in profileTags" :key="tag" class="pt-tag">#{{ tag }}</span>
          </div>
        </div>
      </div>
    </header>

    <section class="pt-section">
      <h2 class="pt-section-title">&gt; {{ $t('about.skills') }}</h2>
      <div class="pt-skill-groups">
        <div v-for="cat in skillCategories" :key="cat.title" class="pt-skill-group">
          <div class="pt-skill-label">{{ cat.title }}</div>
          <div class="pt-skill-list">
            <span v-for="skill in cat.skills" :key="skill" class="pt-skill-chip">{{ skill }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-section">
      <h2 class="pt-section-title">&gt; {{ $t('about.timeline') }}</h2>
      <ul class="pt-timeline">
        <li v-for="item in timelineItems" :key="item.date" class="pt-timeline-item">
          <span class="pt-timeline-date">{{ item.date }}</span>
          <div class="pt-timeline-body">
            <div class="pt-timeline-title">{{ item.title }}</div>
            <p class="pt-timeline-desc">{{ item.desc }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section class="pt-section">
      <h2 class="pt-section-title">&gt; {{ $t('about.contact') }}</h2>
      <div class="pt-contacts">
        <a
          :href="`https://github.com/${config.github.owner}`"
          target="_blank"
          rel="noopener noreferrer"
          class="pt-contact-link"
        >
          <span class="pt-contact-label">GitHub</span>
          <span class="pt-contact-val">@{{ config.github.owner }} &nearr;</span>
        </a>
        <a :href="`mailto:${config.blog.email}`" class="pt-contact-link">
          <span class="pt-contact-label">{{ $t('about.email') }}</span>
          <span class="pt-contact-val">{{ config.blog.email }} &nearr;</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/useSeo'
import { config } from '@/config'

const { t } = useI18n()

usePageSeo(
  computed(() => t('pageTitle.about')),
  computed(() => t('seo.about')),
  '/about',
)

const profileTags = ['AI', 'Open Source', 'Tech']

const skillCategories = computed(() => [
  { title: t('about.skillsBackend'), skills: ['Python', 'Node.js', 'SQL'] },
  { title: t('about.skillsFrontend'), skills: ['TypeScript', 'Vue', 'HTML / CSS'] },
  { title: t('about.skillsTools'), skills: ['Git', 'Docker', 'Linux', 'AI Tools'] },
])

const timelineItems = computed(() => [
  { date: '2026', title: t('about.timelineItem1Title'), desc: t('about.timelineItem1Desc') },
])
</script>

<style scoped>
.pt-page {
  max-width: 720px;
  margin: 0 auto;
}

.pt-page-header {
  margin-bottom: 36px;
  padding-bottom: 24px;
  border-bottom: 1px dashed var(--pt-border);
}

.pt-eyebrow {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--pt-secondary);
  margin-bottom: 16px;
}

.pt-profile {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pt-avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  border: 1px solid var(--pt-border);
  object-fit: cover;
  flex-shrink: 0;
}

.pt-page-title {
  margin: 0 0 4px;
  font-family: 'Shippori Mincho', 'Noto Serif JP', 'Noto Serif SC', serif;
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--pt-text);
}

.pt-bio {
  margin: 0 0 8px;
  font-size: 0.92rem;
  color: var(--pt-secondary);
}

.pt-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pt-tag {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--pt-accent);
}

.pt-section {
  margin-bottom: 36px;
}

.pt-section-title {
  margin: 0 0 16px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--pt-text);
}

.pt-skill-groups {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pt-skill-label {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--pt-secondary);
  margin-bottom: 6px;
}

.pt-skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pt-skill-chip {
  padding: 3px 10px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  color: var(--pt-text);
  border: 1px dashed var(--pt-border);
  border-radius: 2px;
}

.pt-timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pt-timeline-item {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px dotted var(--pt-border);
}

.pt-timeline-date {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.82rem;
  color: var(--pt-accent);
  flex-shrink: 0;
}

.pt-timeline-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--pt-text);
  margin-bottom: 4px;
}

.pt-timeline-desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--pt-secondary);
}

.pt-contacts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pt-contact-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px dashed var(--pt-border);
  border-radius: 2px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease;
}

.pt-contact-link:hover {
  border-color: var(--pt-accent);
}

.pt-contact-label {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  color: var(--pt-secondary);
}

.pt-contact-val {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  color: var(--pt-text);
}

.pt-contact-link:hover .pt-contact-val {
  color: var(--pt-accent);
}

@media (max-width: 540px) {
  .pt-profile {
    flex-direction: column;
    text-align: center;
  }

  .pt-tags {
    justify-content: center;
  }
}
</style>

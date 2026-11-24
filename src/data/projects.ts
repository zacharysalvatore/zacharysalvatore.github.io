export interface Project {
  name: string
  description: string
  tech: string[]
  url: string
}

export interface Category {
  key: string
  icon: string
  label: string
  projects: Project[]
}

export const developingProjects: Project[] = [
  {
    name: 'zacharysalvatore.github.io',
    description: '个人博客与在线工具站，基于 Vue 3 + Vite + TypeScript 构建并部署在 GitHub Pages。',
    tech: ['Vue', 'Vite', 'TypeScript'],
    url: 'https://github.com/zacharysalvatore/zacharysalvatore.github.io',
  },
]

export const categories: Category[] = [
  {
    key: 'developing',
    icon: '🚧',
    label: 'projects.categoryDeveloping',
    projects: developingProjects,
  },
  {
    key: 'blog',
    icon: '🌐',
    label: 'projects.categoryBlog',
    projects: [
      {
        name: 'zacharysalvatore.github.io',
        description: '个人博客主页，基于 GitHub Pages 部署的静态博客站点。',
        tech: ['Vue', 'GitHub Pages'],
        url: 'https://github.com/zacharysalvatore/zacharysalvatore.github.io',
      },
    ],
  },
]

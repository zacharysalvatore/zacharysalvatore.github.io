/**
 * 博客配置文件
 *
 * 优先从 .env 读取环境变量（import.meta.env.VITE_*），
 * 若未配置则使用下方默认值。
 * 保留 .env 是为了在部署平台（如 GitHub Pages / Vercel）上可以注入环境变量。
 */

// --- 可选：统一后端基址（自建 Cloudflare Worker 时配置） ---
// 留空时，GitHub API 自动回退为直连官方 https://api.github.com，
// 依赖私有后端的服务（浏览量、友链、Vibe Coding 等）将优雅降级。
const BACKEND_BASE = (import.meta.env.VITE_BACKEND_BASE || '').replace(/\/+$/, '')

// --- 后端域名池 ---
const BACKEND_POOL_ENABLED =
  Boolean(BACKEND_BASE) && import.meta.env.VITE_BACKEND_POOL_ENABLED === 'true'

const BACKEND_POOL: readonly string[] = (() => {
  if (!BACKEND_BASE) return []
  if (!BACKEND_POOL_ENABLED) return [BACKEND_BASE]
  const raw = import.meta.env.VITE_BACKEND_POOL
  const list = raw
    ? raw.split(',').map((s) => s.trim()).filter(Boolean)
    : [BACKEND_BASE]
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of list) {
    const normalized = item.replace(/\/+$/, '')
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    out.push(normalized)
  }
  return out.length > 0 ? out : [BACKEND_BASE]
})()

// --- GitHub 配置 ---
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'zacharysalvatore'
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'zacharysalvatore.github.io'

// --- GitHub REST 基址 ---
// 配置了自定义 Worker 时走 <BACKEND_BASE>/github/api；否则留空，由 src/utils/githubApi.ts 直连 api.github.com
const GITHUB_API_BASE = (
  import.meta.env.VITE_GITHUB_API_BASE ?? (BACKEND_BASE ? `${BACKEND_BASE}/github/api` : '')
).replace(/\/+$/, '')

// --- GitHub 用户信息 API ---
// 配置了自定义 Worker 时走 <BACKEND_BASE>/github/user；否则直连 https://api.github.com/users
const GITHUB_USER_API = (
  import.meta.env.VITE_GITHUB_USER_API ??
  (BACKEND_BASE ? `${BACKEND_BASE}/github/user` : 'https://api.github.com/users')
).replace(/\/+$/, '')

// --- Gitee 配置（可选，留空则不请求 Gitee 动态） ---
const GITEE_OWNER = import.meta.env.VITE_GITEE_OWNER || ''

// --- 站点域名 ---
// canonical / og:url / sitemap.xml 的唯一来源。
const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://zacharysalvatore.github.io'
).replace(/\/+$/, '')

// --- 博客元信息 ---
const BLOG_TITLE = 'Zach_Gao'
const BLOG_AUTHOR = 'Zach_Gao'
const BLOG_AVATAR = 'https://github.com/zacharysalvatore.png'
const BLOG_EMAIL = 'scottelfron@gmail.com'

// --- 浏览器标题模板 ---
// 可用变量: {current_page} — 当前页面名称
const TITLE_TEMPLATE = '{current_page} | Blog - {blog_title}'

// --- 开发中项目仓库列表（用于获取最近提交） ---
const DEVELOPING_REPOS = [
  'zacharysalvatore.github.io',
]

// --- 评论配置（Gitalk） ---
const GITALK_PROXY = BACKEND_BASE
  ? `${BACKEND_BASE}/github/access_token`
  : 'https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token'
const GITALK_CLIENT_ID = import.meta.env.VITE_GITALK_CLIENT_ID || ''

// --- 节假日 API ---
// 第三方公开接口，CORS 自身放行，保持直连不经代理
const HOLIDAY_API_BASE = 'https://date.nager.at/api/v3/publicholidays'
const HOLIDAY_COUNTRY = 'CN'

// --- Cline 推荐/免费模型 API（可选） ---
const CLINE_MODELS_API =
  import.meta.env.VITE_CLINE_API_BASE ??
  (BACKEND_BASE ? `${BACKEND_BASE}/cline/model/recommended` : '')

// --- Cline 全量模型目录 API（可选） ---
const CLINE_MODELS_ALL_API =
  import.meta.env.VITE_CLINE_ALL_API ??
  (BACKEND_BASE ? `${BACKEND_BASE}/cline/model/all` : 'https://openrouter.ai/api/v1/models')

// --- Vibe Coding 活动 API（可选） ---
const VIBE_API =
  import.meta.env.VITE_CODING_DATA_API ?? (BACKEND_BASE ? `${BACKEND_BASE}/coding/data` : '')

// --- 缓存 TTL（毫秒） ---
const ARTICLES_CACHE_TTL = 5 * 60 * 1000 // 5 分钟

export const config = {
  /** 站点域名：canonical / og:url / sitemap 的唯一来源 */
  site: {
    url: SITE_URL,
  },
  /** 统一后端基址（未配置自定义 Worker 时为空字符串） */
  backendBase: BACKEND_BASE,
  /** 是否启用域名轮转 */
  backendPoolEnabled: BACKEND_POOL_ENABLED,
  /** 后端域名池 */
  backendPool: BACKEND_POOL,
  github: {
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    /** GitHub REST 代理基址（空字符串表示直连官方 api.github.com） */
    apiBase: GITHUB_API_BASE,
    userApi: GITHUB_USER_API,
  },
  gitee: {
    owner: GITEE_OWNER,
  },
  gitalk: {
    clientID: GITALK_CLIENT_ID,
    proxy: GITALK_PROXY,
  },
  blog: {
    title: BLOG_TITLE,
    author: BLOG_AUTHOR,
    avatar: BLOG_AVATAR,
    email: BLOG_EMAIL,
    titleTemplate: TITLE_TEMPLATE,
  },
  developingRepos: DEVELOPING_REPOS,
  holiday: {
    apiBase: HOLIDAY_API_BASE,
    country: HOLIDAY_COUNTRY,
  },
  cline: {
    apiBase: CLINE_MODELS_API,
    allApi: CLINE_MODELS_ALL_API,
  },
  vibe: {
    api: VIBE_API,
  },
  cache: {
    articlesTTL: ARTICLES_CACHE_TTL,
  },
} as const

export type Config = typeof config

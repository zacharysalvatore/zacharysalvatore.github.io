import { ref } from 'vue'
import Gitalk from 'gitalk'
import { config } from '@/config'
import { apiUrl } from '@/utils/apiEndpoint'

export function useGitalk(containerId: string, slug: string, title: string) {
  const initialized = ref(false)

  const init = () => {
    const container = document.getElementById(containerId)
    if (!container || initialized.value) return

    // Remove previous instance
    container.innerHTML = ''

    if (!config.gitalk.clientID) {
      container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);font-size:0.9rem;padding:24px 0;">评论系统尚未配置（可在环境变量中配置 Gitalk OAuth App 启用）</p>'
      initialized.value = true
      return
    }

    const gitalk = new Gitalk({
      clientID: config.gitalk.clientID,
      repo: config.github.repo,
      owner: config.github.owner,
      admin: [config.github.owner],
      id: slug,
      title: title,
      body: title,
      distractionFreeMode: false,
      language: 'zh-CN',
      // 本地走 Vite 同源代理换取 access_token，线上直连原有代理地址
      proxy: apiUrl(config.gitalk.proxy),
    })

    gitalk.render(containerId)
    initialized.value = true
  }

  return { init, initialized }
}

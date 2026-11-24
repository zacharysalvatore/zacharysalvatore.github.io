<template>
  <div ref="containerRef" class="pretext-bunny-container" @click="cycleBunny" title="Click to switch bunny">
    <canvas
      ref="canvasRef"
      class="pretext-bunny-canvas"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  dark: boolean
}>()

const BUNNIES: readonly (readonly string[])[] = [
  // #1 Bug bunny (by bug)
  [
    '                              __       ',
    '                     /\\    .-" /       ',
    "                    /  ; .'  .'        ",
    "                   :   :/  .'          ",
    "                    \\  ;-.'            ",
    '       .--""""--..__ /     `.          ',
    "     .'           .'    `o  \\          ",
    '    /                    `   ;         ',
    '   :                  \\      :         ',
    " .-;        -.         `.__.-'         ",
    ':  ;          \\     ,   ;              ',
    "'._:           ;   :   (               ",
    '    \\/  .__    ;    \\   `-.            ',
    ' bug ;     "-,/_..--"`-..__)          ',
    '     \'""--.._ :                        ',
  ],
  // #2 Standing bunny with long ears
  [
    '     / \\                    ',
    '    / _ \\                   ',
    '   | / \\ |                  ',
    '   ||   || _______          ',
    '   ||   || |\\     \\         ',
    '   ||   || ||\\     \\        ',
    '   ||   || || \\    |        ',
    '   ||   || ||  \\__/         ',
    '   ||   || ||   ||          ',
    '    \\\\_/ \\_/ \\_//           ',
    '   /   _     _   \\         ',
    '  /               \\        ',
    '  |    O     O    |        ',
    '  |   \\  ___  /   |        ',
    ' /     \\ \\_/ /     \\       ',
    '/  -----  |  -----  \\      ',
    '|     \\__/|\\__/     |      ',
    '\\       |_|_|       /      ',
    ' \\_____       _____/       ',
    '       \\     /              ',
    '       |     |              ',
  ],
  // #3 Star bunny
  [
    '   ***                      ',
    '  ** **                     ',
    ' **   **                    ',
    ' **   **         ****      ',
    ' **   **       **   ****   ',
    ' **  **       *   **   **  ',
    '  **  *      *  **  ***  **',
    '   **  *    *  **     **  *',
    '    ** **  ** **        ** ',
    '    **   **  **            ',
    '   *           *           ',
    '  *             *          ',
    ' *    0     0    *         ',
    ' *   /   @   \\   *        ',
    ' *   \\__/ \\__/   *        ',
    '   *     W     *           ',
    '     **     **             ',
    '       *****               ',
  ],
  // #4 Sparkle bunny (original tall)
  [
    '                      /|      __        ',
    '*             +      / |   ,-~ /        ',
    '     .              Y :|  //  /         ',
    '         .          | jj /( .^     *    ',
    '               *    >-"~"-v"            ',
    '*                  /       Y            ',
    '   .     .        jo  o    |     .      ',
    '                 ( ~T~     j            ',
    "      +           >._-' _./         +  ",
    '               /| ;-"~ _  l             ',
    '  .           / l/ ,-"~    \\     +      ',
    '              \\//\\/      .- \\            ',
    '       +       Y        /    Y          ',
    '               l       I     !          ',
    '               ]\\      _\\    /"\\        ',
    '              (" ~----( ~   Y.  )       ',
    '          ~~~~~~~~~~~~~~~~~~~~~~~~~~    ',
  ],
]

interface CharCell {
  ch: string
  baseX: number
  baseY: number
  lineIndex: number
  charIndex: number
  isWave: boolean
  isFace: boolean
  isSparkle: boolean
}

const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let bunnyIndex = Math.floor(Math.random() * BUNNIES.length)
let bunnyLines = BUNNIES[bunnyIndex]

const BASE_FONT_SIZE = 16
const BASE_LINE_H = 18
let lineH = BASE_LINE_H
let activeFont = `${BASE_FONT_SIZE}px "JetBrains Mono", "Fira Code", monospace`
let chars: CharCell[] = []
let animFrame = 0
let canvasHeight = 0
let lastTime = 0
let accumPhase = 0
let accumWavePhase = 0

let targetIntensity = 0
let currentIntensity = 0
let mouseIdleTimer: ReturnType<typeof setTimeout> | null = null
const IDLE_TIMEOUT = 1500

let ro: ResizeObserver | null = null

function getColors() {
  return props.dark
    ? { color: '#E0DED8', accent: '#E8563A', secondary: '#8A8A8A' }
    : { color: '#1A1A1A', accent: '#3acce8', secondary: '#6B6B6B' }
}

function buildChars(ctx: CanvasRenderingContext2D, width: number) {
  chars = []
  let maxLen = 0
  for (const line of bunnyLines) {
    if (line.length > maxLen) maxLen = line.length
  }

  const testFont = `${BASE_FONT_SIZE}px "JetBrains Mono", "Fira Code", monospace`
  ctx.font = testFont
  const baseCharW = ctx.measureText('M').width
  const neededWidth = maxLen * baseCharW
  const availWidth = Math.max(width - 24, 100)
  const scale = neededWidth > availWidth ? availWidth / neededWidth : 1
  const fontSize = Math.max(9, Math.floor(BASE_FONT_SIZE * scale))
  activeFont = `${fontSize}px "JetBrains Mono", "Fira Code", monospace`
  lineH = Math.round(BASE_LINE_H * (fontSize / BASE_FONT_SIZE))

  ctx.font = activeFont
  const charW = ctx.measureText('M').width
  const totalArtHeight = bunnyLines.length * lineH
  const startY = (canvasHeight - totalArtHeight) / 2
  const artWidth = maxLen * charW
  const startX = (width - artWidth) / 2

  for (let li = 0; li < bunnyLines.length; li++) {
    const line = bunnyLines[li]
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci]
      if (ch === ' ') continue
      const isWave = ch === '~' && li >= bunnyLines.length - 2
      const isSparkle = ch === '*' || ch === '+' || ch === '.'
      const isFace = (ch === 'O' || ch === 'o' || ch === '0' || ch === '@') && !isSparkle

      chars.push({
        ch,
        baseX: startX + ci * charW,
        baseY: startY + li * lineH,
        lineIndex: li,
        charIndex: ci,
        isWave,
        isFace,
        isSparkle,
      })
    }
  }
}

function resize() {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = container.getBoundingClientRect()
  const width = rect.width
  if (width <= 0) return

  ctx.font = `${BASE_FONT_SIZE}px "JetBrains Mono", "Fira Code", monospace`
  const baseCharW = ctx.measureText('M').width
  let maxLen = 0
  for (const line of bunnyLines) {
    if (line.length > maxLen) maxLen = line.length
  }
  const neededWidth = maxLen * baseCharW
  const availWidth = Math.max(width - 24, 100)
  const scale = neededWidth > availWidth ? availWidth / neededWidth : 1
  const scaledLineH = Math.round(BASE_LINE_H * scale)
  const artHeight = bunnyLines.length * scaledLineH
  const VERT_PAD = 40
  canvasHeight = Math.max(artHeight + VERT_PAD * 2, 220)

  canvas.width = width * dpr
  canvas.height = canvasHeight * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${canvasHeight}px`
  container.style.height = `${canvasHeight}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  buildChars(ctx, width)
}

function animate(time: number) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dt = lastTime ? Math.min(time - lastTime, 50) : 16.67
  lastTime = time

  const lerpFactor = 1 - Math.exp(-dt * 0.0024)
  currentIntensity += (targetIntensity - currentIntensity) * lerpFactor

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.font = activeFont
  ctx.textBaseline = 'top'

  const { color, accent, secondary } = getColors()
  const t = currentIntensity
  const ampY = 0.3 + t * 1.8
  const ampX = 0.1 + t * 0.6
  const speed = 0.0003 + t * 0.00035
  const waveSpeed = 0.0008 + t * 0.0006
  const alphaBase = 0.8 - t * 0.12
  const alphaRange = 0.15 + t * 0.15

  accumPhase += dt * speed
  accumWavePhase += dt * waveSpeed

  for (const c of chars) {
    const phase = accumPhase + c.lineIndex * 0.25 + c.charIndex * 0.08
    let dx = Math.cos(phase * 0.7) * ampX
    let dy = Math.sin(phase) * ampY
    let alpha = alphaBase + alphaRange * Math.sin(phase + 0.5)

    if (c.isWave) {
      dy = Math.sin(accumWavePhase + c.charIndex * 0.3) * (0.5 + t * 2.0)
      alpha = alphaBase + alphaRange * Math.sin(accumWavePhase + c.charIndex * 0.3)
    }

    if (currentIntensity > 1.5) {
      const scatter = (currentIntensity - 1.5) * 2
      dx += Math.cos(phase * 1.3) * scatter * 2
      dy += Math.sin(phase * 1.1) * scatter * 1.5
    }

    ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha))
    ctx.fillStyle = c.isFace ? accent : c.isWave || c.isSparkle ? secondary : color
    ctx.fillText(c.ch, c.baseX + dx, c.baseY + dy)
  }

  ctx.globalAlpha = 1
  animFrame = requestAnimationFrame(animate)
}

function cycleBunny() {
  bunnyIndex = (bunnyIndex + 1) % BUNNIES.length
  bunnyLines = BUNNIES[bunnyIndex]
  resize()
}

function onDocMouseMove() {
  if (targetIntensity < 2) targetIntensity = 1
  if (mouseIdleTimer) clearTimeout(mouseIdleTimer)
  mouseIdleTimer = setTimeout(() => {
    if (targetIntensity === 1) targetIntensity = 0
  }, IDLE_TIMEOUT)
}

function onCanvasEnter() {
  targetIntensity = 2
  if (mouseIdleTimer) clearTimeout(mouseIdleTimer)
}

function onCanvasLeave() {
  targetIntensity = 1
  if (mouseIdleTimer) clearTimeout(mouseIdleTimer)
  mouseIdleTimer = setTimeout(() => {
    targetIntensity = 0
  }, IDLE_TIMEOUT)
}

onMounted(() => {
  document.addEventListener('mousemove', onDocMouseMove, { passive: true })
  canvasRef.value?.addEventListener('mouseenter', onCanvasEnter, { passive: true })
  canvasRef.value?.addEventListener('mouseleave', onCanvasLeave, { passive: true })

  if (containerRef.value) {
    ro = new ResizeObserver(() => {
      if (animFrame) cancelAnimationFrame(animFrame)
      resize()
      animFrame = requestAnimationFrame(animate)
    })
    ro.observe(containerRef.value)
  }

  resize()
  animFrame = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
  if (mouseIdleTimer) clearTimeout(mouseIdleTimer)
  lastTime = 0
  document.removeEventListener('mousemove', onDocMouseMove)
  canvasRef.value?.removeEventListener('mouseenter', onCanvasEnter)
  canvasRef.value?.removeEventListener('mouseleave', onCanvasLeave)
  ro?.disconnect()
})
</script>

<style scoped>
.pretext-bunny-container {
  width: 100%;
  min-height: 220px;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.pretext-bunny-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

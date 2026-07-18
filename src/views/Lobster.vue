<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getHero } from '../api'
import LiquidMetalBackground from '../components/LiquidMetalBackground.vue'

interface LobsterData {
  name: string
  tagline: string
  emoji: string
  description: string
  birthday: string
  chatInfo: string
  skillInfo: string
  footer: string
  tooltip: string
  link: string
  icons: {
    description: string
    birthday: string
    chat: string
    skill: string
  }
}

const lobsterData = ref<LobsterData>({
  name: 'Max',
  tagline: '',
  emoji: '🦞',
  description: '',
  birthday: '',
  chatInfo: '',
  skillInfo: '',
  footer: '',
  tooltip: '',
  link: '/',
  icons: {
    description: '',
    birthday: '',
    chat: '',
    skill: ''
  }
})

const showTooltip = ref(false)
const ripples = ref<Array<{ id: number }>>([])
let rippleIdCounter = 0

const createRipple = () => {
  const id = rippleIdCounter++
  ripples.value.push({ id })
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id)
  }, 1000)
}

const handleClick = () => {
  createRipple()
  setTimeout(() => {
    window.location.href = lobsterData.value.link
  }, 180)
}

onMounted(async () => {
  try {
    const data = await getHero()
    lobsterData.value = data
  } catch (e) {
    console.error('Failed to fetch hero data:', e)
  }
})
</script>

<template>
  <div class="lobster-page">
    <LiquidMetalBackground />

    <div class="safe-area-cover" aria-hidden="true"></div>

    <nav class="lobster-nav">
      <a href="/" class="nav-logo">
        <span class="logo-icon">◆</span>
        <span class="logo-text">YUANFU</span>
      </a>
      <a href="/" class="nav-link">
        <span class="nav-bracket">[</span>
        Portfolio
        <span class="nav-bracket">]</span>
      </a>
    </nav>

    <main class="lobster-main">
      <section class="hero-panel">
        <button
          class="lobster-link"
          @click="handleClick"
          @mouseenter="showTooltip = true"
          @mouseleave="showTooltip = false"
          aria-label="Discover Max"
        >
          <span class="lobster-orbit orbit-1"></span>
          <span class="lobster-orbit orbit-2"></span>
          <span class="lobster-orbit orbit-3"></span>
          <span class="lobster-glow"></span>
          <span class="lobster">{{ lobsterData.emoji }}</span>

          <span
            v-for="ripple in ripples"
            :key="ripple.id"
            class="ripple"
          ></span>

          <span class="tooltip" :class="{ visible: showTooltip }">
            {{ lobsterData.tooltip }}
          </span>
        </button>

        <div class="hero-copy">
          <p class="eyebrow">[ companion process ]</p>
          <h1 class="name">{{ lobsterData.name }}</h1>
          <p class="tagline">{{ lobsterData.tagline }}</p>
        </div>

        <div class="content-card">
          <div class="info-item">
            <span class="icon">{{ lobsterData.icons.description }}</span>
            <span>{{ lobsterData.description }}</span>
          </div>
          <div class="info-item">
            <span class="icon">{{ lobsterData.icons.birthday }}</span>
            <span>{{ lobsterData.birthday }}</span>
          </div>
          <div class="info-item">
            <span class="icon">{{ lobsterData.icons.chat }}</span>
            <span>{{ lobsterData.chatInfo }}</span>
          </div>
          <div class="info-item">
            <span class="icon">{{ lobsterData.icons.skill }}</span>
            <span>{{ lobsterData.skillInfo }}</span>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <a href="/" class="back-link">← Back to Portfolio</a>
      <span>{{ lobsterData.footer }}</span>
    </footer>
  </div>
</template>

<style scoped>
.lobster-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 22%, rgba(170, 59, 255, 0.18), transparent 34%),
    radial-gradient(circle at 82% 72%, rgba(0, 212, 255, 0.12), transparent 36%),
    var(--bg-gradient, linear-gradient(135deg, #0a0a0f 0%, #14121e 100%));
}

.safe-area-cover {
  position: fixed;
  top: -100px;
  left: 0;
  right: 0;
  height: 100px;
  z-index: calc(var(--z-modal, 1000) + 1);
  background: #0a0a0f;
}

.lobster-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-modal, 1000);
  min-height: 70px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background:
    linear-gradient(180deg, rgba(10, 10, 15, 0.82), rgba(10, 10, 15, 0.54)),
    linear-gradient(90deg, rgba(170, 59, 255, 0.12), rgba(0, 212, 255, 0.06), rgba(170, 59, 255, 0.1));
  backdrop-filter: blur(18px) saturate(145%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(0, 212, 255, 0.16);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 10px 34px rgba(10, 10, 15, 0.28),
    0 0 26px rgba(170, 59, 255, 0.08);
}

.lobster-nav::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(170, 59, 255, 0.35), rgba(0, 212, 255, 0.9), rgba(255, 0, 128, 0.32), transparent);
  background-size: 220% 100%;
  box-shadow: 0 0 18px rgba(0, 212, 255, 0.35);
  animation: navFlow 8s ease-in-out infinite;
}

.nav-logo,
.nav-link {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-icon {
  font-size: 20px;
  color: var(--accent, #aa3bff);
  filter: drop-shadow(0 0 10px rgba(170, 59, 255, 0.5));
}

.logo-text {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-h, #ffffff);
  letter-spacing: 0.05em;
}

.nav-link {
  color: var(--text, #a0a0c0);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 13px;
  padding: 8px 16px;
  border-radius: var(--radius-sm, 4px);
  transition: all var(--transition-normal, 0.25s);
}

.nav-link:hover {
  color: var(--accent, #aa3bff);
  background: rgba(170, 59, 255, 0.1);
}

.nav-bracket {
  color: var(--accent-secondary, #00d4ff);
  opacity: 0.55;
}

.lobster-main {
  position: relative;
  z-index: 1;
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 118px 24px 56px;
}

.hero-panel {
  width: min(960px, 100%);
  min-height: 620px;
  padding: clamp(28px, 5vw, 56px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background:
    radial-gradient(circle at 50% 12%, rgba(0, 212, 255, 0.1), transparent 38%),
    linear-gradient(145deg, rgba(15, 12, 24, 0.75), rgba(5, 6, 11, 0.75) 68%);
  backdrop-filter: blur(24px) saturate(135%);
  -webkit-backdrop-filter: blur(24px) saturate(135%);
  border: 1px solid rgba(170, 59, 255, 0.32);
  border-radius: 18px;
  box-shadow:
    0 0 60px rgba(170, 59, 255, 0.22),
    0 0 120px rgba(0, 0, 0, 0.52),
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 0 70px rgba(0, 0, 0, 0.34);
}

.hero-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 260px;
  height: 1px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.9), transparent);
  box-shadow: 0 0 22px rgba(0, 212, 255, 0.38);
}

.lobster-link {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: clamp(180px, 34vw, 260px);
  aspect-ratio: 1;
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.lobster-glow {
  position: absolute;
  inset: 19%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(0, 212, 255, 0.28), transparent 58%),
    radial-gradient(circle, rgba(170, 59, 255, 0.22), transparent 68%);
  filter: blur(8px);
}

.lobster {
  position: relative;
  z-index: 2;
  font-size: clamp(96px, 18vw, 148px);
  line-height: 1;
  filter:
    drop-shadow(0 0 34px rgba(0, 212, 255, 0.5))
    drop-shadow(0 0 64px rgba(170, 59, 255, 0.42));
  animation: float 3.6s ease-in-out infinite;
  transition: transform var(--transition-normal, 0.25s), filter var(--transition-normal, 0.25s);
}

.lobster-link:hover .lobster {
  transform: scale(1.08) rotate(2deg);
  filter:
    drop-shadow(0 0 42px rgba(0, 212, 255, 0.72))
    drop-shadow(0 0 80px rgba(170, 59, 255, 0.62));
}

.lobster-orbit {
  position: absolute;
  inset: 14%;
  border: 1px solid rgba(0, 212, 255, 0.42);
  border-radius: 50%;
  box-shadow: 0 0 24px rgba(0, 212, 255, 0.18);
  animation: orbitPulse 4s ease-in-out infinite;
}

.orbit-2 {
  inset: 6%;
  border-color: rgba(170, 59, 255, 0.36);
  animation-delay: 0.7s;
}

.orbit-3 {
  inset: -2%;
  border-color: rgba(255, 0, 128, 0.22);
  animation-delay: 1.4s;
}

.ripple {
  position: absolute;
  z-index: 1;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(0, 212, 255, 0.8);
  border-radius: 50%;
  animation: rippleEffect 1s ease-out forwards;
}

.tooltip {
  position: absolute;
  bottom: -28px;
  left: 50%;
  z-index: 4;
  transform: translateX(-50%) translateY(10px);
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.82);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 13px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  background: rgba(10, 10, 15, 0.75);
  border: 1px solid rgba(170, 59, 255, 0.32);
  border-radius: 999px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all var(--transition-normal, 0.25s);
}

.tooltip.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.hero-copy {
  margin-top: 30px;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--accent, #aa3bff);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 13px;
  text-transform: uppercase;
  text-shadow: 0 0 16px rgba(170, 59, 255, 0.35);
}

.name {
  margin: 0;
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: clamp(42px, 8vw, 82px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
  background:
    linear-gradient(115deg, transparent 24%, rgba(255, 235, 250, 0.95) 34%, var(--accent-pink, #ff0080) 42%, #ff6bd6 50%, var(--accent-gold, #ffd700) 58%, transparent 70%),
    linear-gradient(90deg, var(--text-h, #ffffff), var(--accent-secondary, #00d4ff), var(--accent, #aa3bff), var(--accent-pink, #ff0080), var(--text-h, #ffffff));
  background-size: 320% 100%, 100% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 28px rgba(255, 0, 128, 0.16);
  animation: titleGradientFlow 18s linear infinite;
}

.tagline {
  margin: 14px 0 0;
  color: var(--accent-secondary, #00d4ff);
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: clamp(13px, 2.4vw, 17px);
  letter-spacing: 0;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
}

.content-card {
  width: min(540px, 100%);
  margin-top: 40px;
  padding: 26px;
  display: grid;
  gap: 12px;
  background:
    radial-gradient(circle at 20% 0%, rgba(170, 59, 255, 0.1), transparent 38%),
    rgba(10, 10, 15, 0.75);
  backdrop-filter: blur(22px) saturate(135%);
  -webkit-backdrop-filter: blur(22px) saturate(135%);
  border: 1px solid rgba(170, 59, 255, 0.26);
  border-radius: 12px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 16px 40px rgba(0, 0, 0, 0.28);
}

.info-item {
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: start;
  gap: 10px;
  color: var(--text, #a0a0c0);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 14px;
  line-height: 1.65;
  text-align: left;
}

.icon {
  font-size: 18px;
  filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.36));
}

.footer {
  position: relative;
  z-index: 1;
  padding: 20px 16px;
  padding-bottom: max(20px, env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted, #6b6b8a);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 13px;
  text-align: center;
}

.back-link {
  color: var(--accent, #aa3bff);
  text-decoration: none;
  transition: color var(--transition-normal, 0.25s), text-shadow var(--transition-normal, 0.25s);
}

.back-link:hover {
  color: var(--accent-secondary, #00d4ff);
  text-shadow: 0 0 16px rgba(0, 212, 255, 0.45);
}

@keyframes navFlow {
  0%, 100% {
    background-position: 0% 50%;
    opacity: 0.64;
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(-4deg) scale(1);
  }
  50% {
    transform: translateY(-14px) rotate(4deg) scale(1.04);
  }
}

@keyframes orbitPulse {
  0%, 100% {
    opacity: 0.42;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.86;
    transform: scale(1.06);
  }
}

@keyframes rippleEffect {
  0% {
    opacity: 0.9;
    transform: scale(0.2);
  }
  100% {
    opacity: 0;
    transform: scale(9);
  }
}

@media (max-width: 768px) {
  .lobster-nav {
    min-height: 60px;
    padding: 0 16px;
  }

  .nav-link {
    padding: 8px 10px;
    font-size: 12px;
  }

  .lobster-main {
    padding: 92px 16px 36px;
  }

  .hero-panel {
    min-height: auto;
    padding: 30px 18px;
    border-radius: 14px;
  }

  .content-card {
    margin-top: 30px;
    padding: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lobster,
  .lobster-orbit,
  .ripple,
  .name,
  .lobster-nav::after {
    animation: none;
  }

  .name {
    background-position: 50% 50%, 0% 50%;
  }
}
</style>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Terminal from './components/Terminal.vue'
import StatsSection from './components/StatsSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ContactSection from './components/ContactSection.vue'
import LiquidMetalBackground from './components/LiquidMetalBackground.vue'
import { getProfile, getSite } from './api'
import Lobster from './views/Lobster.vue'

const profile = ref({ name: '', title: '' })
const site = ref({ footer: '', version: '', slogan: '', pet: { label: '', name: '', emoji: '', link: '' } })

onMounted(async () => {
  try {
    const [profileData, siteData] = await Promise.all([
      getProfile(),
      getSite()
    ])
    profile.value = profileData
    site.value = siteData
  } catch (e) {
    console.error('Failed to fetch data:', e)
  }
})

const route = useRoute()
const isLobsterPage = computed(() => route.path === '/lobster')

const isVisible = ref(false)
const isMenuOpen = ref(false)
const isHeroVisible = ref(true)
const subtitleRef = ref<HTMLElement | null>(null)

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Stats', href: '#stats' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' }
]

const handleScroll = () => {
  const navbar = document.querySelector('.navbar')
  if (subtitleRef.value && navbar) {
    const subtitleRect = subtitleRef.value.getBoundingClientRect()
    const navbarHeight = (navbar as HTMLElement).offsetHeight

    // Show logo when Relentless Coder reaches/passes navbar
    // Hide when above navbar (visible in hero)
    const showLogo = subtitleRect.top <= navbarHeight
    isHeroVisible.value = !showLogo
  }
}

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- Lobster Page -->
  <Lobster v-if="isLobsterPage" />

  <!-- Main Portfolio Page -->
  <div v-else id="app" :class="{ visible: isVisible }">
    <LiquidMetalBackground />

    <!-- Skip Link for Accessibility -->
    <a href="#main-content" class="skip-link">// Skip to Main</a>

    <!-- Safe Area Cover for iPhone Dynamic Island -->
    <div class="safe-area-cover" aria-hidden="true"></div>

    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <a href="/" class="nav-logo" :class="{ hidden: isHeroVisible }">
          <span class="logo-icon">◆</span>
          <span class="logo-text">{{ profile.name }}</span>
        </a>

        <div class="nav-links desktop-only">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            class="nav-link"
          >
            <span class="nav-bracket">[</span>
            {{ link.name }}
            <span class="nav-bracket">]</span>
          </a>
        </div>

        <button
          class="mobile-menu-btn"
          :class="{ active: isMenuOpen }"
          @click="isMenuOpen = !isMenuOpen"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" :class="{ open: isMenuOpen }">
        <a
          v-for="link in navLinks"
          :key="link.name"
          :href="link.href"
          class="mobile-nav-link"
          @click="isMenuOpen = false"
        >
          {{ link.name }}
        </a>
      </div>
    </nav>

    <main id="main-content">
      <!-- Hero Section with Terminal -->
      <section id="home" class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="hero-greeting">Hi, I'm</span>
              <span class="hero-name">{{ profile.name }}</span>
            </h1>
            <p ref="subtitleRef" class="hero-subtitle">{{ profile.title }}</p>
          </div>
          <Terminal />
        </div>
      </section>

      <!-- Stats Section -->
      <section id="stats">
        <StatsSection />
      </section>

      <!-- Experience Section -->
      <section id="experience">
        <ProjectsSection />
      </section>

      <!-- Skills Section -->
      <section id="skills">
        <SkillsSection />
      </section>

      <!-- Contact Section -->
      <section id="contact">
        <ContactSection />
      </section>

      <!-- Lobster Easter Egg -->
      <div class="lobster-easter-egg">
        <a :href="site.pet.link" class="lobster-link" aria-label="Visit lobster page">
          <span class="lobster-text">{{ site.pet.label }} {{ site.pet.name }}</span>
          <span class="lobster-icon">{{ site.pet.emoji }}</span>
        </a>
      </div>

      <!-- Slogan -->
      <p class="slogan">"{{ site.slogan }}"</p>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>{{ site.footer }}</p>
      <p class="version">{{ site.version }}</p>
    </footer>
  </div>
</template>

<style scoped>
#app {
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

#app.visible {
  opacity: 1;
}

main,
.footer {
  position: relative;
  z-index: 1;
}

/* ========================================
   Safe Area Cover (iPhone Dynamic Island)
   ======================================== */

.safe-area-cover {
  position: fixed;
  top: -100px;
  left: 0;
  right: 0;
  height: 100px;
  z-index: calc(var(--z-modal, 1000) + 1);
  background: #0a0a0f;
}

/* ========================================
   Navigation Bar
   ======================================== */

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-modal, 1000);
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
  overflow: hidden;
}

.navbar::before,
.navbar::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
}

.navbar::before {
  top: 0;
  height: 100%;
  background:
    radial-gradient(circle at 18% 0%, rgba(170, 59, 255, 0.14), transparent 32%),
    radial-gradient(circle at 78% 0%, rgba(0, 212, 255, 0.1), transparent 30%);
  opacity: 0.65;
}

.navbar::after {
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(170, 59, 255, 0.35), rgba(0, 212, 255, 0.9), rgba(255, 0, 128, 0.32), transparent);
  background-size: 220% 100%;
  box-shadow: 0 0 18px rgba(0, 212, 255, 0.35);
  animation: navFlow 8s ease-in-out infinite;
}

.nav-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg, 24px);
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm, 8px);
  text-decoration: none;
}

.logo-icon {
  font-size: 20px;
  color: var(--accent, #aa3bff);
  filter: drop-shadow(0 0 10px var(--accent-glow, rgba(170, 59, 255, 0.5)));
}

.logo-text {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-h, #ffffff);
  letter-spacing: 0.05em;
}

.nav-logo.hidden {
  opacity: 0;
  pointer-events: none;
}

.nav-links {
  display: flex;
  gap: var(--space-sm, 8px);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  color: var(--text, #a0a0c0);
  text-decoration: none;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 13px;
  transition: all var(--transition-normal, 0.25s);
  border-radius: var(--radius-sm, 4px);
}

.nav-link:hover {
  color: var(--accent, #aa3bff);
  background: rgba(170, 59, 255, 0.1);
}

.nav-bracket {
  color: var(--accent-secondary, #00d4ff);
  opacity: 0.5;
  transition: opacity var(--transition-normal, 0.25s);
}

.nav-link:hover .nav-bracket {
  opacity: 1;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.mobile-menu-btn span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text, #a0a0c0);
  transition: all var(--transition-normal, 0.25s);
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.mobile-menu {
  position: relative;
  z-index: 1;
  display: none;
  background: rgba(10, 10, 15, 0.9);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-top: 1px solid rgba(170, 59, 255, 0.2);
}

.mobile-menu.open {
  display: flex;
  flex-direction: column;
  padding: var(--space-md, 16px);
}

.mobile-nav-link {
  padding: 16px;
  color: var(--text, #a0a0c0);
  text-decoration: none;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  border-bottom: 1px solid rgba(170, 59, 255, 0.1);
  transition: all var(--transition-fast, 0.15s);
}

.mobile-nav-link:hover {
  color: var(--accent, #aa3bff);
  padding-left: 24px;
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

/* ========================================
   Hero Section
   ======================================== */

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px var(--space-lg, 24px) var(--space-2xl, 48px);
}

.hero-content {
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--space-2xl, 48px);
  align-items: center;
}

.hero-text {
  text-align: left;
}

.hero-greeting {
  display: block;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 16px;
  color: var(--accent, #aa3bff);
  margin-bottom: var(--space-md, 16px);
}

.hero-name {
  display: block;
  font-size: clamp(32px, 5vw, 56px);
  background:
    linear-gradient(115deg, transparent 24%, rgba(255, 255, 255, 0.92) 34%, #00f0ff 42%, #4f7cff 50%, #8a5cff 58%, transparent 70%),
    linear-gradient(90deg, var(--text-h, #ffffff), var(--accent-secondary, #00d4ff), #4f7cff, #8a5cff, #00f0ff, var(--text-h, #ffffff));
  background-size: 320% 100%, 100% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 28px rgba(0, 212, 255, 0.2);
  animation: titleGradientFlow 17s linear infinite;
}

.hero-subtitle {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: clamp(18px, 3vw, 24px);
  color: var(--accent-secondary, #00d4ff);
  margin-bottom: var(--space-sm, 8px);
  text-shadow: 0 0 20px var(--accent-cyan-glow, rgba(0, 212, 255, 0.5));
  animation: thinkingPulse 3.2s ease-in-out infinite;
}

.hero-tagline {
  font-size: 16px;
  color: var(--text-muted, #6b6b8a);
  max-width: 400px;
}

@keyframes thinkingPulse {
  0%, 100% {
    opacity: 0.86;
    text-shadow: 0 0 16px rgba(0, 212, 255, 0.35);
  }
  50% {
    opacity: 1;
    text-shadow:
      0 0 22px rgba(0, 212, 255, 0.62),
      0 0 36px rgba(170, 59, 255, 0.28);
  }
}

/* ========================================
   Sections
   ======================================== */

section {
  scroll-margin-top: 80px;
}

/* ========================================
   Footer
   ======================================== */

.footer {
  margin-top: 60px;
  padding: var(--space-2xl, 48px) var(--space-lg, 24px);
  text-align: center;
  border-top: 1px solid var(--border, rgba(170, 59, 255, 0.2));
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 13px;
  color: var(--text-muted, #6b6b8a);
}

.footer p {
  margin: 12px 0;
}

.version {
  opacity: 0.6;
  font-size: 12px;
}

.slogan {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: 14px;
  color: var(--accent, #aa3bff);
  text-shadow: 0 0 10px var(--accent-glow, rgba(170, 59, 255, 0.4));
  font-style: italic;
  text-align: center;
  margin-top: 60px;
  margin-bottom: var(--space-lg, 24px);
}

.icp {
  opacity: 0.6;
  font-size: 12px;
}

.icp a {
  color: var(--text-muted, #6b6b8a);
  text-decoration: none;
}

.icp a:hover {
  color: var(--accent, #aa3bff);
}

/* ========================================
   Responsive
   ======================================== */

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: var(--space-xl, 32px);
  }

  .hero-text {
    text-align: center;
  }

  .hero-tagline {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .nav-container {
    height: 60px;
  }

  .hero-section {
    padding: 80px var(--space-md, 16px) var(--space-xl, 32px);
  }
}

@media (prefers-reduced-motion: reduce) {
  #app {
    opacity: 1;
  }

  .hero-subtitle {
    animation: none;
  }

  .hero-name {
    animation: none;
    background-position: 50% 50%, 0% 50%;
  }

  .navbar::after {
    animation: none;
  }
}

/* Lobster Easter Egg */
.lobster-easter-egg {
  display: flex;
  justify-content: center;
  padding: var(--space-xl, 32px);
}

.lobster-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm, 8px);
  padding: 12px 24px;
  background: rgba(20, 18, 30, 0.6);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: var(--radius-lg, 12px);
  color: var(--text-h, #ffffff);
  text-decoration: none;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 14px;
  transition: all var(--transition-normal, 0.25s);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.lobster-link:hover {
  border-color: #ff6464;
  background: rgba(255, 100, 100, 0.15);
  box-shadow: 0 0 30px rgba(255, 100, 100, 0.4);
  transform: translateY(-2px);
}

.lobster-icon {
  font-size: 24px;
  filter: drop-shadow(0 0 10px rgba(255, 100, 100, 0.5));
}

.lobster-text {
  color: var(--text, #a0a0c0);
}
</style>

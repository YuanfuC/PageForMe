<script setup lang="ts">
import Terminal from '../components/Terminal.vue'
import StatsSection from '../components/StatsSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import SkillsSection from '../components/SkillsSection.vue'
import ContactSection from '../components/ContactSection.vue'
import portfolioData from '../models/portfolio.json'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isVisible = ref(false)
const isMenuOpen = ref(false)
const clickCount = ref(0)
let clickTimer: ReturnType<typeof setTimeout> | null = null

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Stats', href: '#stats' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' }
]

// Easter egg: Click logo 3 times quickly to navigate to lobster page
const handleLogoClick = () => {
  clickCount.value++

  if (clickTimer) {
    clearTimeout(clickTimer)
  }

  clickTimer = setTimeout(() => {
    clickCount.value = 0
  }, 2000)

  if (clickCount.value >= 3) {
    clickCount.value = 0
    router.push('/lobster')
  }
}

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <div id="home" :class="{ visible: isVisible }">
    <!-- Skip Link for Accessibility -->
    <a href="#main-content" class="skip-link">// Skip to Main</a>

    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo" @click="handleLogoClick" style="cursor: pointer">
          <span class="logo-icon">◆</span>
          <span class="logo-text">YUANFU</span>
        </div>

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
              <span class="hero-name">YUANFU</span>
            </h1>
            <p class="hero-subtitle">{{ portfolioData.profile.title }}</p>
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
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p class="slogan">"Slow to be fast, retreat to advance"</p>
      <p>&copy; 2026 YUANFU</p>
      <p class="icp">浙ICP备2026019344号-1</p>
    </footer>
  </div>
</template>

<style scoped>
#home {
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

#home.visible {
  opacity: 1;
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
  background: rgba(10, 10, 15, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(170, 59, 255, 0.2);
}

.nav-container {
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
  transition: opacity 0.3s;
}

.nav-logo:hover {
  opacity: 0.8;
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
  display: none;
  background: rgba(10, 10, 15, 0.98);
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
  background: linear-gradient(135deg, var(--text-h, #ffffff), var(--accent, #aa3bff));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: clamp(18px, 3vw, 24px);
  color: var(--accent-secondary, #00d4ff);
  margin-bottom: var(--space-sm, 8px);
  text-shadow: 0 0 20px var(--accent-cyan-glow, rgba(0, 212, 255, 0.5));
}

.hero-tagline {
  font-size: 16px;
  color: var(--text-muted, #6b6b8a);
  max-width: 400px;
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
  padding: var(--space-lg, 24px);
  text-align: center;
  border-top: 1px solid var(--border, rgba(170, 59, 255, 0.2));
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 13px;
  color: var(--text-muted, #6b6b8a);
}

.footer p {
  margin: 6px 0;
}

.slogan {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: 14px;
  color: var(--accent, #aa3bff);
  text-shadow: 0 0 10px var(--accent-glow, rgba(170, 59, 255, 0.4));
  font-style: italic;
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
  #home {
    opacity: 1;
  }
}
</style>

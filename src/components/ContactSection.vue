<script setup lang="ts">
import portfolioData from '../models/portfolio.json'

const social = portfolioData.social
const sectionTitle = "Let's Connect"
const sectionSubtitle = "Feel free to reach out for collaborations or just a friendly hello"

const socialLinks = [
  {
    name: 'GitHub',
    icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
    url: social.github,
    color: '#ffffff'
  },
  {
    name: 'Email',
    icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    url: `mailto:${social.email}`,
    color: '#aa3bff'
  }
]
</script>

<template>
  <section class="contact-section">
    <div class="contact-container">
      <div class="contact-content">
        <h2 class="contact-title">{{ sectionTitle }}</h2>
        <p class="contact-subtitle">{{ sectionSubtitle }}</p>

        <div class="social-links">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            :style="{ '--link-color': link.color }"
          >
            <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
              <path :d="link.icon"/>
            </svg>
            <span class="social-name">{{ link.name }}</span>
            <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="terminal-decoration">
        <div class="terminal-line"></div>
        <div class="terminal-line"></div>
        <div class="terminal-line"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  padding: var(--space-3xl, 64px) var(--space-lg, 24px);
  position: relative;
}

.contact-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-gold, #ffd700), transparent);
}

.contact-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: var(--space-2xl, 48px);
}

.contact-content {
  flex: 1;
  text-align: center;
}

.contact-title {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, var(--accent, #aa3bff), var(--accent-gold, #ffd700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-md, 16px);
}

.contact-subtitle {
  font-size: 16px;
  color: var(--text-muted, #6b6b8a);
  margin-bottom: var(--space-xl, 32px);
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm, 8px);
  align-items: center;
}

.social-link {
  display: flex;
  align-items: center;
  gap: var(--space-md, 16px);
  padding: 16px 24px;
  width: 100%;
  max-width: 320px;
  background: var(--glass-bg, rgba(20, 18, 30, 0.6));
  border: 1px solid var(--border, rgba(170, 59, 255, 0.2));
  border-radius: var(--radius-lg, 12px);
  color: var(--text-h, #ffffff);
  text-decoration: none;
  transition: all var(--transition-normal, 0.25s);
  backdrop-filter: blur(var(--glass-blur, 16px));
  -webkit-backdrop-filter: blur(16px);
}

.social-link:hover {
  transform: translateX(8px);
  border-color: var(--link-color, #aa3bff);
  background: var(--accent-bg, rgba(170, 59, 255, 0.15));
  box-shadow: 0 0 30px var(--link-color, rgba(170, 59, 255, 0.3));
}

.social-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.social-name {
  flex: 1;
  text-align: left;
  font-weight: 500;
  font-size: 15px;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  opacity: 0;
  transition: all var(--transition-normal, 0.25s);
}

.social-link:hover .arrow-icon {
  opacity: 1;
  transform: translate(4px, -4px);
}

.terminal-decoration {
  display: none;
}

@media (min-width: 768px) {
  .terminal-decoration {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm, 8px);
    padding: var(--space-lg, 24px);
    background: rgba(10, 10, 15, 0.8);
    border: 1px solid rgba(170, 59, 255, 0.2);
    border-radius: var(--radius-md, 8px);
  }

  .terminal-line {
    height: 8px;
    background: rgba(170, 59, 255, 0.3);
    border-radius: 4px;
  }

  .terminal-line:nth-child(1) {
    width: 120px;
  }

  .terminal-line:nth-child(2) {
    width: 80px;
  }

  .terminal-line:nth-child(3) {
    width: 100px;
  }
}

@media (max-width: 768px) {
  .contact-container {
    flex-direction: column;
  }
}
</style>

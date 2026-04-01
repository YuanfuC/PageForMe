<script setup lang="ts">
import portfolioData from '../models/portfolio.json'

const skills = portfolioData.skills
const sectionTitle = "Skills & Expertise"
const sectionSubtitle = "Technologies and tools I work with"
</script>

<template>
  <section class="skills-section">
    <div class="section-header">
      <h2 class="section-title">{{ sectionTitle }}</h2>
      <p class="section-subtitle">{{ sectionSubtitle }}</p>
    </div>

    <div class="skills-grid">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="skill-card"
      >
        <div class="skill-number">{{ skill.number }}</div>
        <div class="skill-icon">{{ skill.icon }}</div>
        <h3 class="skill-title">{{ skill.title }}</h3>
        <p class="skill-description">{{ skill.description }}</p>
        <div class="skill-tech">
          <span
            v-for="tech in skill.technologies"
            :key="tech"
            class="tech-item"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-section {
  padding: var(--space-3xl, 64px) var(--space-lg, 24px);
  position: relative;
}

.skills-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-secondary, #00d4ff), transparent);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-2xl, 48px);
}

.section-title {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-h, #ffffff);
  margin-bottom: var(--space-md, 16px);
}

.section-subtitle {
  color: var(--text-muted, #6b6b8a);
  font-size: 16px;
}

.skills-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg, 24px);
}

.skill-card {
  background: var(--glass-bg, rgba(20, 18, 30, 0.6));
  border: 1px solid var(--border, rgba(170, 59, 255, 0.2));
  border-radius: var(--radius-xl, 20px);
  padding: var(--space-xl, 32px);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal, 0.25s);
  backdrop-filter: blur(var(--glass-blur, 16px));
  -webkit-backdrop-filter: blur(16px);
}

.skill-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent, #aa3bff), var(--accent-secondary, #00d4ff));
  opacity: 0;
  transition: opacity var(--transition-normal, 0.25s);
}

.skill-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent, #aa3bff);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4),
              0 0 30px rgba(170, 59, 255, 0.2);
}

.skill-card:hover::before {
  opacity: 1;
}

.skill-number {
  position: absolute;
  top: var(--space-lg, 24px);
  right: var(--space-lg, 24px);
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: 48px;
  font-weight: 900;
  color: rgba(170, 59, 255, 0.1);
  line-height: 1;
}

.skill-icon {
  font-size: 40px;
  margin-bottom: var(--space-md, 16px);
  filter: drop-shadow(0 0 10px var(--accent-glow, rgba(170, 59, 255, 0.5)));
}

.skill-title {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-h, #ffffff);
  margin-bottom: var(--space-sm, 8px);
}

.skill-description {
  font-size: 13px;
  color: var(--text-muted, #6b6b8a);
  line-height: 1.6;
  margin-bottom: var(--space-md, 16px);
  min-height: 40px;
}

.skill-tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs, 4px);
}

.tech-item {
  padding: 4px 10px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 4px;
  font-size: 11px;
  color: var(--accent-secondary, #00d4ff);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
}

@media (max-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 580px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>

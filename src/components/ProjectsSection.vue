<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProjects } from '../api'

interface Project {
  id: number
  name: string
  description: string
  category: string
  tech: string[]
  link: string
  color: string
}

const projects = ref<Project[]>([])
const sectionTitle = "Work Experience"
const sectionSubtitle = "Companies I've worked with and contributed to"

onMounted(async () => {
  try {
    const data = await getProjects()
    projects.value = data.projects || []
  } catch (e) {
    console.error('Failed to fetch projects:', e)
  }
})
</script>

<template>
  <section class="projects-section">
    <div class="section-header">
      <h2 class="section-title">{{ sectionTitle }}</h2>
      <p class="section-subtitle">{{ sectionSubtitle }}</p>
    </div>

    <div class="projects-grid">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        :class="{ 'is-unknown': !project.link }"
        :style="{ '--card-accent': project.color }"
      >
        <div class="project-image">
          <div class="project-placeholder" :style="{ background: `linear-gradient(135deg, ${project.color}22, ${project.color}44)` }">
            <span class="project-name-large">{{ project.name.toUpperCase() }}</span>
          </div>
          <div class="project-category">{{ project.category }}</div>
        </div>

        <div class="project-content">
          <p class="project-description">{{ project.description }}</p>

          <div class="project-tech">
            <span
              v-for="tech in project.tech"
              :key="tech"
              class="tech-tag"
            >
              {{ tech }}
            </span>
          </div>

          <a v-if="project.link" :href="project.link" target="_blank" rel="noopener" class="project-link">
            <span>Visit</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>
          <span v-else class="project-link pending">
            <span>Pending</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6V12L16 14"/>
              <path d="M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-section {
  padding: var(--space-3xl, 64px) var(--space-lg, 24px);
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
  letter-spacing: 0;
  background:
    linear-gradient(115deg, transparent 24%, rgba(255, 245, 190, 0.94) 34%, var(--accent-gold, #ffd700) 42%, #ff7a00 50%, #ff4d5e 58%, transparent 70%),
    linear-gradient(90deg, var(--accent-gold, #ffd700), #ff7a00, var(--accent, #aa3bff), var(--accent-secondary, #00d4ff), #ff4d5e, var(--accent-gold, #ffd700));
  background-size: 320% 100%, 100% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 24px rgba(255, 122, 0, 0.16);
  animation: titleGradientFlow 17.8s linear infinite;
  margin-bottom: var(--space-md, 16px);
}

.section-subtitle {
  color: var(--text-muted, #6b6b8a);
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.projects-grid {
  max-width: 1500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-lg, 24px);
}

.project-card {
  display: flex;
  flex-direction: column;
  background: var(--glass-bg, rgba(20, 18, 30, 0.6));
  border: 1px solid var(--border, rgba(170, 59, 255, 0.2));
  border-radius: var(--radius-xl, 20px);
  overflow: hidden;
  transition: all var(--transition-normal, 0.25s);
  backdrop-filter: blur(var(--glass-blur, 16px));
  -webkit-backdrop-filter: blur(16px);
}

.project-card:hover {
  transform: translateY(-8px);
  border-color: var(--card-accent, #aa3bff);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4),
              0 0 30px var(--card-accent, rgba(170, 59, 255, 0.2));
}

.project-card.is-unknown {
  border-color: rgba(255, 100, 100, 0.35);
  background:
    linear-gradient(135deg, rgba(255, 100, 100, 0.08), transparent 45%),
    var(--glass-bg, rgba(20, 18, 30, 0.6));
}

.project-card.is-unknown .project-placeholder {
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 100, 100, 0.26), transparent 38%),
    linear-gradient(135deg, rgba(255, 100, 100, 0.1), rgba(170, 59, 255, 0.16)) !important;
}

.project-card.is-unknown .project-name-large {
  color: rgba(255, 255, 255, 0.88);
  text-shadow:
    0 0 24px rgba(255, 100, 100, 0.65),
    0 0 48px rgba(170, 59, 255, 0.35);
}

.project-card.is-unknown .project-name-large::after {
  content: '?';
  display: inline-block;
  margin-left: 6px;
  color: var(--card-accent, #ff6464);
  animation: questionPulse 1.8s ease-in-out infinite;
}

.project-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.project-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-name-large {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: clamp(22px, 2vw, 32px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
  line-height: 1.18;
  text-align: center;
  max-width: calc(100% - 32px);
  overflow-wrap: anywhere;
  color: var(--text-h, #ffffff);
  text-shadow: 0 0 30px var(--card-accent, rgba(170, 59, 255, 0.5));
}

.project-category {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--card-accent, #aa3bff);
  border: 1px solid var(--card-accent, rgba(170, 59, 255, 0.3));
}

.project-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-lg, 24px);
}

.project-name {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: 18px;
  font-weight: 600;
  color: var(--text-h, #ffffff);
  margin-bottom: var(--space-sm, 8px);
}

.project-description {
  font-size: 14px;
  color: var(--text-muted, #6b6b8a);
  line-height: 1.6;
  margin-bottom: var(--space-md, 16px);
  min-height: 48px;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs, 4px);
  margin-bottom: var(--space-md, 16px);
  flex: 1;
  align-content: flex-start;
}

.tech-tag {
  padding: 4px 10px;
  background: rgba(170, 59, 255, 0.1);
  border: 1px solid rgba(170, 59, 255, 0.2);
  border-radius: 4px;
  font-size: 11px;
  color: var(--accent, #aa3bff);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
}

.project-link {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: var(--space-sm, 8px);
  margin-top: auto;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid var(--card-accent, rgba(170, 59, 255, 0.4));
  border-radius: var(--radius-md, 8px);
  color: var(--card-accent, #aa3bff);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all var(--transition-normal, 0.25s);
}

.project-link:hover {
  background: var(--card-accent, #aa3bff);
  color: #ffffff;
  box-shadow: 0 0 20px var(--card-accent, rgba(170, 59, 255, 0.4));
}

.project-link.pending {
  cursor: default;
  color: rgba(255, 100, 100, 0.85);
  border-style: dashed;
  opacity: 0.9;
}

.project-link.pending:hover {
  background: transparent;
  color: rgba(255, 100, 100, 0.85);
  box-shadow: none;
}

@keyframes questionPulse {
  0%, 100% {
    opacity: 0.45;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

@media (max-width: 1280px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 900px;
  }
}

@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 580px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>

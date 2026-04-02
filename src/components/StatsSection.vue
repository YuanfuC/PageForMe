<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getStats } from '../api'

interface Stat {
  label: string
  value: string
  icon: string
}

const stats = ref<Stat[]>([])
const animatedValues = ref<number[]>([])

onMounted(async () => {
  try {
    const data = await getStats()
    stats.value = data.stats || []
    animatedValues.value = stats.value.map(() => 0)

    stats.value.forEach((stat, index) => {
      const targetValue = parseInt(stat.value.replace(/\D/g, '')) || 0
      const duration = 2000
      const steps = 60
      const increment = targetValue / steps
      let currentStep = 0

      const timer = setInterval(() => {
        currentStep++
        animatedValues.value[index] = Math.min(
          Math.floor(currentStep * increment),
          targetValue
        )

        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, duration / steps)
    })
  } catch (e) {
    console.error('Failed to fetch stats:', e)
  }
})
</script>

<template>
  <section class="stats-section">
    <div class="stats-container">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="stat-card"
      >
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  padding: var(--space-2xl, 48px) var(--space-lg, 24px);
  position: relative;
}

.stats-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent, #aa3bff), transparent);
}

.stats-container {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg, 24px);
}

.stat-card {
  text-align: center;
  padding: var(--space-xl, 32px);
  background: var(--glass-bg, rgba(20, 18, 30, 0.6));
  border: 1px solid var(--border, rgba(170, 59, 255, 0.2));
  border-radius: var(--radius-lg, 12px);
  transition: all var(--transition-normal, 0.25s);
  backdrop-filter: blur(var(--glass-blur, 16px));
  -webkit-backdrop-filter: blur(16px);
}

.stat-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent, #aa3bff);
  box-shadow: 0 0 30px rgba(170, 59, 255, 0.3);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: var(--space-md, 16px);
  filter: drop-shadow(0 0 10px var(--accent-glow, rgba(170, 59, 255, 0.5)));
}

.stat-value {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: clamp(28px, 4vw, 36px);
  font-weight: 700;
  color: var(--accent-secondary, #00d4ff);
  text-shadow: 0 0 20px var(--accent-cyan-glow, rgba(0, 212, 255, 0.6));
  margin-bottom: var(--space-sm, 8px);
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted, #6b6b8a);
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md, 16px);
  }

  .stat-card {
    padding: var(--space-lg, 24px);
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import lobsterData from '../models/lobster.json'

const showTooltip = ref(false)
const ripples = ref<Array<{ id: number }>>([])
let rippleIdCounter = 0

// Canvas setup
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let animationId: number | null = null
let meteorInterval: ReturnType<typeof setInterval> | null = null

interface MousePosition {
  x: number | null
  y: number | null
}

const mouse = ref<MousePosition>({ x: null, y: null })
const mouseRadius = 200

class Particle {
  x!: number
  y!: number
  size!: number
  speedX!: number
  speedY!: number
  color!: string
  alpha!: number

  constructor(width: number, height: number) {
    this.reset(width, height)
  }

  reset(width: number, height: number) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.size = Math.random() * 2 + 0.5
    this.speedX = (Math.random() - 0.5) * 0.5
    this.speedY = (Math.random() - 0.5) * 0.5
    this.color = this.randomColor()
    this.alpha = Math.random() * 0.5 + 0.3
  }

  randomColor(): string {
    const colors = [
      'rgba(170, 59, 255,',   // purple
      'rgba(0, 212, 255,',     // cyan
      'rgba(255, 215, 0,',     // gold
      'rgba(255, 0, 128,',     // pink
      'rgba(255, 255, 255,'    // white
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  update(width: number, height: number, mouseX: number | null, mouseY: number | null) {
    this.x += this.speedX
    this.y += this.speedY

    // Mouse interaction
    if (mouseX !== null && mouseY !== null) {
      const dx = mouseX - this.x
      const dy = mouseY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < mouseRadius) {
        const force = (mouseRadius - distance) / mouseRadius
        this.x -= dx * force * 0.02
        this.y -= dy * force * 0.02
      }
    }

    // Boundary detection
    if (this.x < 0 || this.x > width) this.speedX *= -1
    if (this.y < 0 || this.y > height) this.speedY *= -1
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath()
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    context.fillStyle = this.color + this.alpha + ')'
    context.fill()
  }
}

const resizeCanvas = () => {
  if (canvas.value && ctx) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    initParticles()
  }
}

const initParticles = () => {
  if (!canvas.value) return
  particles = []
  const count = Math.floor((canvas.value.width * canvas.value.height) / 5000)
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(canvas.value.width, canvas.value.height))
  }
}

const connectParticles = () => {
  if (!ctx) return
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x
      const dy = particles[a].y - particles[b].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 120) {
        ctx.strokeStyle = `rgba(170, 59, 255, ${(1 - distance / 120) * 0.3})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(particles[a].x, particles[a].y)
        ctx.lineTo(particles[b].x, particles[b].y)
        ctx.stroke()
      }
    }
  }
}

const animate = () => {
  if (!ctx || !canvas.value) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  const mouseX = mouse.value.x
  const mouseY = mouse.value.y

  for (const particle of particles) {
    particle.update(canvas.value.width, canvas.value.height, mouseX, mouseY)
    particle.draw(ctx)
  }
  connectParticles()
  animationId = requestAnimationFrame(animate)
}

const handleMouseMove = (e: MouseEvent) => {
  mouse.value.x = e.x
  mouse.value.y = e.y
}

const handleMouseOut = () => {
  mouse.value.x = null
  mouse.value.y = null
}

const createRipple = () => {
  const id = rippleIdCounter++
  ripples.value.push({ id })
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id)
  }, 1000)
}

const handleClick = () => {
  createRipple()
  // Navigate to main page
  window.location.href = lobsterData.link
}

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    resizeCanvas()
    animate()

    // Meteors
    meteorInterval = setInterval(() => {
      const meteor = document.createElement('div')
      meteor.className = 'meteor'
      meteor.style.left = `${Math.random() * 100}%`
      meteor.style.animationDuration = `${Math.random() * 2 + 2}s`
      document.body.appendChild(meteor)
      setTimeout(() => meteor.remove(), 4000)
    }, 3000)
  }

  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseout', handleMouseOut)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (meteorInterval) {
    clearInterval(meteorInterval)
  }
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseout', handleMouseOut)
})
</script>

<template>
  <div class="lobster-page">
    <!-- Safe Area Cover for iPhone Dynamic Island -->
    <div class="safe-area-cover" aria-hidden="true"></div>

    <!-- Navigation -->
    <nav class="lobster-nav">
      <a href="/index.html" class="nav-logo">
        <span class="logo-icon">◆</span>
        <span class="logo-text">YUANFU</span>
      </a>
    </nav>

    <!-- Particle Canvas -->
    <canvas
      ref="canvas"
      class="particles-canvas"
    />

    <!-- Stars Background -->
    <div class="stars">
      <div
        v-for="i in 200"
        :key="i"
        class="star"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${Math.random() * 3 + 2}s`
        }"
      />
    </div>

    <!-- Main Content -->
    <div class="lobster-wrapper">
      <button
        class="lobster-link"
        @click="handleClick"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
        aria-label="Discover MAX"
      >
        <div class="lobster-ring ring-1" />
        <div class="lobster-ring ring-2" />
        <div class="lobster-ring ring-3" />
        <div class="lobster">{{ lobsterData.emoji }}</div>
        <div class="pulse-hint" />

        <!-- Ripples -->
        <div
          v-for="ripple in ripples"
          :key="ripple.id"
          class="ripple"
        />

        <!-- Tooltip -->
        <div class="tooltip" :class="{ visible: showTooltip }">
          {{ lobsterData.tooltip }}
        </div>
      </button>

      <h1 class="name">{{ lobsterData.name }}</h1>
      <p class="tagline">{{ lobsterData.tagline }}</p>

      <div class="content-card">
        <div class="info-item">
          <span class="icon">🦐</span>
          {{ lobsterData.description }}
        </div>
        <div class="info-item">
          <span class="icon">🎂</span>
          {{ lobsterData.birthday }}
        </div>
        <div class="info-item">
          <span class="icon">💬</span>
          {{ lobsterData.chatInfo }}
        </div>
        <div class="info-item">
          <span class="icon">⚡</span>
          {{ lobsterData.skillInfo }}
        </div>
      </div>
    </div>

    <!-- Footer -->
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
}

.safe-area-cover {
  position: fixed;
  top: -100px;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 101;
  background: #0a0a0f;
}

.lobster-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 24px;
  min-height: 70px;
  display: flex;
  align-items: center;
  background: rgba(10, 10, 15, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(170, 59, 255, 0.2);
}

.nav-logo {
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
  color: #ffffff;
  letter-spacing: 0.05em;
}

.lobster-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a0f 0%, #14121e 50%, #1a1025 100%);
}

.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* Stars */
.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle ease-in-out infinite alternate;
}

@keyframes twinkle {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

/* Meteor */
.meteor {
  position: fixed;
  width: 2px;
  height: 80px;
  background: linear-gradient(to bottom, rgba(170, 59, 255, 0.8), transparent);
  animation: meteor 3s linear infinite;
  opacity: 0;
}

@keyframes meteor {
  0% { transform: translateY(-100px) translateX(0); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: translateY(100vh) translateX(300px); opacity: 0; }
}

/* Lobster Wrapper */
.lobster-wrapper {
  position: relative;
  z-index: 10;
  text-align: center;
  padding-top: 100px;
  padding-bottom: 80px;
  flex: 1;
}

.lobster-link {
  position: relative;
  display: inline-block;
  background: none;
  border: none;
  cursor: pointer;
  padding: 40px;
}

.lobster {
  font-size: clamp(100px, 20vw, 150px);
  display: block;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 60px rgba(170, 59, 255, 0.6));
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-5deg) scale(1); }
  50% { transform: translateY(-20px) rotate(5deg) scale(1.05); }
}

.lobster-link:hover .lobster {
  transform: scale(1.2) rotate(0deg);
  filter: drop-shadow(0 0 80px rgba(170, 59, 255, 0.9));
}

/* Rings */
.lobster-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid rgba(170, 59, 255, 0.4);
  border-radius: 50%;
  animation: ring 3s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
  pointer-events: none;
}

.ring-1 {
  width: 180px;
  height: 180px;
}

.ring-2 {
  width: 220px;
  height: 220px;
  animation-delay: 0.5s;
}

.ring-3 {
  width: 260px;
  height: 260px;
  animation-delay: 1s;
}

@keyframes ring {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0; }
}

.lobster-link:hover .lobster-ring {
  border-color: rgba(0, 212, 255, 0.8);
}

/* Pulse Hint */
.pulse-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulseHint 2s ease-out infinite;
  pointer-events: none;
}

@keyframes pulseHint {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
}

/* Ripple */
.ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border: 2px solid rgba(0, 212, 255, 0.8);
  border-radius: 50%;
  animation: rippleEffect 1s ease-out forwards;
}

@keyframes rippleEffect {
  0% { width: 10px; height: 10px; opacity: 1; }
  100% { width: 150px; height: 150px; opacity: 0; }
}

/* Tooltip */
.tooltip {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  color: rgba(255, 255, 255, 0.8);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.3s;
  pointer-events: none;
  background: rgba(10, 10, 15, 0.9);
  border: 1px solid rgba(170, 59, 255, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.tooltip.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Name */
.name {
  color: white;
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: clamp(32px, 6vw, 56px);
  font-weight: 700;
  margin-top: 30px;
  text-shadow: 0 0 30px rgba(170, 59, 255, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
  letter-spacing: 0.05em;
}

@keyframes glow {
  0% { text-shadow: 0 0 30px rgba(170, 59, 255, 0.5); }
  100% { text-shadow: 0 0 50px rgba(170, 59, 255, 0.8), 0 0 80px rgba(0, 212, 255, 0.4); }
}

/* Tagline */
.tagline {
  color: var(--accent-secondary, #00d4ff);
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: clamp(14px, 2.5vw, 18px);
  margin-top: 15px;
  letter-spacing: 3px;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
}

/* Content Card */
.content-card {
  margin-top: 50px;
  background: rgba(20, 18, 30, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(170, 59, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 1s ease-out 0.5s both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.info-item {
  color: var(--text, #a0a0c0);
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 12px;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
}

.info-item:last-child {
  margin-bottom: 0;
}

.icon {
  font-size: 20px;
  margin-right: 8px;
}

/* Footer */
.footer {
  position: relative;
  padding: 20px 16px;
  padding-bottom: max(20px, env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  color: var(--text-muted, #6b6b8a);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 13px;
  z-index: 10;
}

.separator {
  display: none;
}

.back-link {
  color: var(--accent, #aa3bff);
  text-decoration: none;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--accent-secondary, #00d4ff);
}

.separator {
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 768px) {
  .content-card {
    margin: 30px var(--space-md, 16px);
    padding: 24px;
  }

  .lobster-ring {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lobster, .lobster-ring, .pulse-hint, .star, .tooltip {
    animation: none;
  }
}
</style>

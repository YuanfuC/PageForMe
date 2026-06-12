<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let animationId = 0
let startTime = 0
let isReducedMotion = false
let isVisible = true
let isReady = false

const pointer = { x: 0.5, y: 0.5 }
const smoothPointer = { x: 0.5, y: 0.5 }
let interactionBoost = 0

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_intensity;

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amp * noise(p);
    p = rotate2d(0.72) * p * 2.03 + vec2(13.1, 7.7);
    amp *= 0.52;
  }
  return value;
}

float particleField(vec2 p, vec2 mouse, float time, float scale, float size) {
  vec2 grid = p * scale;
  vec2 id = floor(grid);
  vec2 cell = fract(grid) - 0.5;

  float rnd = hash(id);
  float rnd2 = hash(id + 19.19);
  vec2 offset = vec2(rnd - 0.5, rnd2 - 0.5) * 0.54;
  float drift = time * (0.22 + rnd * 0.18);
  offset += vec2(sin(drift + rnd * 6.28), cos(drift * 1.17 + rnd2 * 6.28)) * 0.18;

  vec2 worldParticle = (id + 0.5 + offset) / scale;
  float mouseDistance = length(worldParticle - mouse);
  float attraction = exp(-mouseDistance * 8.0) * u_intensity;
  offset += normalize(mouse - worldParticle + 0.0001) * attraction * 0.72;

  float d = length(cell - offset);
  float sparkle = smoothstep(size, 0.0, d);
  sparkle *= smoothstep(0.46, 0.98, rnd);
  sparkle *= 0.5 + 0.5 * sin(time * (1.6 + rnd) + rnd * 18.0);
  sparkle += smoothstep(size * 1.9, 0.0, d) * attraction * 0.8;

  return sparkle;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  vec2 mouse = (u_mouse * u_resolution.xy - 0.5 * u_resolution.xy) / u_resolution.y;

  float t = u_time * 0.2;
  float dist = length(p - mouse);
  float pull = exp(-dist * 3.2) * u_intensity;
  float core = exp(-dist * 8.5) * u_intensity;
  vec2 dir = normalize(p - mouse + 0.0001);
  vec2 warped = p;

  warped += dir * sin(dist * 23.0 - u_time * 1.7) * pull * 0.052;
  warped -= dir * core * 0.028;
  warped += vec2(
    fbm(p * 2.6 + vec2(t, -t * 0.7)),
    fbm(p * 2.4 + vec2(-t * 0.8, t))
  ) * 0.13;

  float metal = fbm(warped * 3.0 + t);
  float veins = sin((warped.x + metal * 0.55) * 8.0 + u_time * 0.32)
              * cos((warped.y - metal * 0.45) * 7.0 - u_time * 0.26);
  float liquid = smoothstep(0.25, 1.03, metal + veins * 0.22 + pull * 0.62);
  float highlight = pow(max(0.0, 1.0 - length(warped - mouse) * 2.05), 3.0) * u_intensity;
  float rim = smoothstep(0.26, 0.92, liquid) * (0.5 + 0.5 * sin(u_time * 0.85 + metal * 8.0));
  float particlesA = particleField(p + warped * 0.18, mouse, u_time * 1.18, 34.0, 0.12);
  float particlesB = particleField(p * 1.08 - warped * 0.09, mouse, u_time * 1.18 + 7.0, 58.0, 0.105) * 0.72;
  float particles = clamp(particlesA + particlesB, 0.0, 1.0);
  float particleGlow = smoothstep(0.02, 0.85, particles);

  vec3 base = vec3(0.035, 0.025, 0.06);
  vec3 purple = vec3(0.42, 0.12, 0.95);
  vec3 cyan = vec3(0.0, 0.72, 0.95);
  vec3 pink = vec3(0.95, 0.02, 0.42);

  vec3 color = base;
  color += purple * liquid * 0.22;
  color += cyan * rim * 0.12;
  color += pink * smoothstep(0.62, 1.0, metal + pull) * 0.1;
  color += cyan * highlight * 0.32;
  color += purple * pull * 0.22;
  color += cyan * core * 0.16;
  color += mix(purple, cyan, metal) * particleGlow * 0.76;
  color += pink * particles * pull * 0.42;

  float vignette = smoothstep(0.92, 0.25, length(uv - 0.5));
  color *= 0.62 + vignette * 0.58;
  color += vec3(0.015, 0.0, 0.03) * (1.0 - vignette);

  gl_FragColor = vec4(color, 0.72);
}
`

const compileShader = (type: number, source: string): WebGLShader | null => {
  if (!gl) return null
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Liquid metal shader compile failed:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

const createProgram = () => {
  if (!gl) return null

  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
  if (!vertexShader || !fragmentShader) return null

  const shaderProgram = gl.createProgram()
  if (!shaderProgram) return null

  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.warn('Liquid metal program link failed:', gl.getProgramInfoLog(shaderProgram))
    gl.deleteProgram(shaderProgram)
    return null
  }

  return shaderProgram
}

const resizeCanvas = () => {
  if (!canvas.value || !gl) return

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
  const width = Math.floor(window.innerWidth * pixelRatio)
  const height = Math.floor(window.innerHeight * pixelRatio)

  if (canvas.value.width !== width || canvas.value.height !== height) {
    canvas.value.width = width
    canvas.value.height = height
    canvas.value.style.width = `${window.innerWidth}px`
    canvas.value.style.height = `${window.innerHeight}px`
    gl.viewport(0, 0, width, height)
  }
}

const draw = (time: number) => {
  if (!canvas.value || !gl || !program || !isReady) return

  const isMobile = window.innerWidth < 768
  const followEase = isMobile ? 0.075 : 0.045
  const baseIntensity = isMobile ? 0.92 : 1.0

  smoothPointer.x += (pointer.x - smoothPointer.x) * followEase
  smoothPointer.y += (pointer.y - smoothPointer.y) * followEase
  interactionBoost += (0 - interactionBoost) * 0.035

  gl.useProgram(program)
  gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.value.width, canvas.value.height)
  gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), smoothPointer.x, smoothPointer.y)
  gl.uniform1f(gl.getUniformLocation(program, 'u_time'), (time - startTime) / 1000)
  gl.uniform1f(gl.getUniformLocation(program, 'u_intensity'), Math.min(baseIntensity + interactionBoost, 1.55))
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

const animate = (time: number) => {
  draw(time)
  if (!isReducedMotion && isVisible) {
    animationId = window.requestAnimationFrame(animate)
  }
}

const startAnimation = () => {
  if (animationId || !isReady) return
  animationId = window.requestAnimationFrame(animate)
}

const stopAnimation = () => {
  if (!animationId) return
  window.cancelAnimationFrame(animationId)
  animationId = 0
}

const nudgeInteraction = (amount: number) => {
  interactionBoost = Math.max(interactionBoost, amount)
  if (!isReducedMotion && isVisible) {
    startAnimation()
  }
}

const updatePointer = (clientX: number, clientY: number, immediate = false) => {
  pointer.x = clientX / window.innerWidth
  pointer.y = 1 - clientY / window.innerHeight

  if (immediate) {
    smoothPointer.x += (pointer.x - smoothPointer.x) * 0.62
    smoothPointer.y += (pointer.y - smoothPointer.y) * 0.62
  }
}

const handlePointerDown = (event: PointerEvent) => {
  updatePointer(event.clientX, event.clientY, true)
  nudgeInteraction(window.innerWidth < 768 ? 0.58 : 0.32)
}

const handlePointerMove = (event: PointerEvent) => {
  updatePointer(event.clientX, event.clientY)
  if (event.pointerType === 'touch') {
    nudgeInteraction(0.36)
  }
}

const handleTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0]
  if (!touch) return
  updatePointer(touch.clientX, touch.clientY, true)
  nudgeInteraction(0.58)
}

const handleTouchMove = (event: TouchEvent) => {
  const touch = event.touches[0]
  if (!touch) return
  updatePointer(touch.clientX, touch.clientY)
  nudgeInteraction(0.36)
}

const handleVisibilityChange = () => {
  isVisible = document.visibilityState === 'visible'
  if (isVisible && !isReducedMotion) {
    startAnimation()
  } else {
    stopAnimation()
  }
}

onMounted(() => {
  if (!canvas.value) return

  isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  gl = canvas.value.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false
  })

  if (!gl) return

  program = createProgram()
  if (!program) return

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  )

  const positionLocation = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  startTime = performance.now()
  isReady = true
  resizeCanvas()
  draw(startTime)

  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('pointerdown', handlePointerDown, { passive: true })
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)

  if (!isReducedMotion) {
    startAnimation()
  }
})

onUnmounted(() => {
  stopAnimation()
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('pointerdown', handlePointerDown)
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('visibilitychange', handleVisibilityChange)

  if (gl && program) {
    gl.deleteProgram(program)
  }
})
</script>

<template>
  <canvas
    ref="canvas"
    class="liquid-metal-background"
    aria-hidden="true"
  />
</template>

<style scoped>
.liquid-metal-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .liquid-metal-background {
    opacity: 0.72;
  }
}

@media (prefers-reduced-motion: reduce) {
  .liquid-metal-background {
    opacity: 0.42;
  }
}
</style>

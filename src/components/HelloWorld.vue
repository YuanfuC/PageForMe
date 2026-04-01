<script setup lang="ts">
import { ref, onMounted } from 'vue'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'
import vueLogo from '../assets/vue.svg'

const count = ref(0)
const isVisible = ref(false)
const isGlitching = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)

  // Random glitch effect
  setInterval(() => {
    if (Math.random() > 0.95) {
      isGlitching.value = true
      setTimeout(() => {
        isGlitching.value = false
      }, 200)
    }
  }, 3000)
})
</script>

<template>
  <!-- Skip Link for Accessibility -->
  <a href="#main-content" class="skip-link">// Skip to Main</a>

  <!-- Main Content -->
  <main id="main-content">
    <!-- Hero Section -->
    <section id="center" :class="{ visible: isVisible, glitching: isGlitching }">
      <div class="hero">
        <img :src="heroImg" class="base" width="170" height="179" alt="" />
        <img :src="vueLogo" class="framework" alt="Vue logo" />
        <img :src="viteLogo" class="vite" alt="Vite logo" />
      </div>

      <div class="hero-content">
        <h1 data-text="BUILD THE FUTURE">BUILD THE FUTURE</h1>
        <p class="description">
          <span class="terminal-prompt">&gt;</span>
          Edit <code>src/App.vue</code> and save to test <abbr title="Hot Module Replacement">HMR</abbr>.
          <br>The next generation of web development is here.
        </p>
        <button class="counter" @click="count++" aria-label="Mint counter">
          <span class="counter-icon">◆</span>
          <span>{{ count }} MINTED</span>
        </button>
      </div>
    </section>

    <div class="ticks"></div>

    <!-- Resources Section -->
    <section id="next-steps" aria-label="Resources and community links">
      <!-- Documentation -->
      <div id="docs">
        <svg class="icon" role="presentation" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        <h2>// DOCS</h2>
        <p>Access the knowledge base</p>
        <ul>
          <li>
            <a href="https://vite.dev/" target="_blank" rel="noopener noreferrer" class="social-link">
              <img class="logo" :src="viteLogo" alt="Vite" />
              Vite_Docs
            </a>
          </li>
          <li>
            <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer" class="social-link">
              <img class="logo" :src="vueLogo" alt="Vue" />
              Vue_Guide
            </a>
          </li>
        </ul>
      </div>

      <!-- Community -->
      <div id="social">
        <svg class="icon" role="presentation" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
        <h2>// COMMUNITY</h2>
        <p>Join the decentralized network</p>
        <ul>
          <li>
            <a href="https://github.com/vitejs/vite" target="_blank" rel="noopener noreferrer" class="social-link">
              <svg class="button-icon" role="presentation" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              GitHub
            </a>
          </li>
          <li>
            <a href="https://chat.vite.dev/" target="_blank" rel="noopener noreferrer" class="social-link">
              <svg class="button-icon" role="presentation" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord
            </a>
          </li>
          <li>
            <a href="https://x.com/vite_js" target="_blank" rel="noopener noreferrer" class="social-link">
              <svg class="button-icon" role="presentation" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X.com
            </a>
          </li>
          <li>
            <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noopener noreferrer" class="social-link">
              <svg class="button-icon" role="presentation" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565c-.781.355-1.055.867-.91 2.034.241 1.964 2.184 9.067 5.393 10.417 1.455.604 3.234.273 4.615-.788v3.176c0 2.539-1.232 3.81-1.853 4.383-.374.343-.083.896.374.896h3.26c.457 0 .748-.553.374-.896-.621-.573-1.853-1.844-1.853-4.383v-3.176c1.381 1.06 3.16 1.392 4.615.788 3.209-1.35 5.152-8.453 5.393-10.417.145-1.167-.129-1.679-.91-2.034-.659-.299-1.664-.621-4.3 1.241C16.046 4.747 13.087 8.686 12 10.8z"/>
              </svg>
              Bluesky
            </a>
          </li>
        </ul>
      </div>
    </section>

    <div class="ticks"></div>
    <section id="spacer"></section>
  </main>
</template>

<style scoped>
/* Entrance Animation */
#center {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

#center.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Glitch Effect */
#center.glitching {
  animation: screenGlitch 0.2s ease-in-out;
}

@keyframes screenGlitch {
  0% { transform: translate(0); }
  20% { transform: translate(-5px, 5px); }
  40% { transform: translate(-5px, -5px); }
  60% { transform: translate(5px, 5px); }
  80% { transform: translate(5px, -5px); }
  100% { transform: translate(0); }
}

/* Terminal Prompt Styling */
.terminal-prompt {
  color: var(--accent, #aa3bff);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-weight: bold;
  margin-right: 8px;
}

/* Counter Icon Animation */
.counter-icon {
  font-size: 1.3em;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: var(--accent-gold, #ffd700);
}

.counter:hover .counter-icon {
  transform: scale(1.3) rotate(45deg);
}

/* Accessibility: Focus visible only for keyboard navigation */
.social-link:focus:not(:focus-visible) {
  outline: none;
}

/* Reduced motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  #center {
    opacity: 1;
    transform: none;
  }

  #center.glitching {
    animation: none;
  }
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LiquidMetalBackground from '../components/LiquidMetalBackground.vue'
import cityAvatar from '../assets/lzg-city-avatar.jpg'
import seasidePortrait from '../assets/lzg-seaside.jpg'
import walkingPortrait from '../assets/lzg-walk.jpg'
import { getLzgProfile, type LzgProfile } from '../lzg-api'

const signalPalette = {
  base: '#100914',
  primary: '#8e204c',
  secondary: '#b9a7ff',
  accent: '#e3337a'
}

const fallbackProfile: LzgProfile = {
  site: {
    name: 'LZG',
    fullName: 'Zonggui Li',
    chineseName: '李宗桂',
    title: 'Personal space, in progress.',
    tagline: 'A quiet place for thoughts, small moments, and signals still finding their shape.',
    footer: '© 2026 LZG',
    version: 'v0.1.0'
  },
  about: {
    eyebrow: 'A SMALL INTRODUCTION',
    heading: 'A softer signal in the noise.',
    body: 'This is a personal corner taking shape slowly - a place to keep what feels worth remembering, before it has to become anything else.'
  },
  now: [
    { label: 'Currently', value: 'In progress', detail: 'Making room for what comes next.' },
    { label: 'Mood', value: 'Quiet signal', detail: 'A little warmth, a little mystery.' },
    { label: 'Elsewhere', value: 'Coming soon', detail: 'More pieces will arrive when they are ready.' }
  ],
  contact: {
    heading: 'Say hello, later.',
    message: 'This corner is still becoming. For now, the best way to know LZG is to let the page breathe.',
    social: []
  }
}

const profile = ref<LzgProfile>(fallbackProfile)
const apiUnavailable = ref(false)

onMounted(async () => {
  try {
    profile.value = await getLzgProfile()
  } catch (error) {
    apiUnavailable.value = true
    console.warn('Using LZG local profile fallback:', error)
  }
})
</script>

<template>
  <div class="lzg-page">
    <LiquidMetalBackground :palette="signalPalette" :opacity="0.82" />

    <a class="lzg-skip-link" href="#lzg-main">Skip to content</a>

    <header class="lzg-nav-wrap">
      <nav class="lzg-nav" aria-label="Primary navigation">
        <a class="lzg-mark" href="#top" aria-label="Back to top">{{ profile.site.name }}</a>
        <div class="lzg-nav-links">
          <a href="#about">About</a>
          <a href="#now">Now</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
    </header>

    <main id="lzg-main">
      <section id="top" class="lzg-hero" aria-labelledby="lzg-title">
        <div class="lzg-container lzg-hero-grid">
          <div class="lzg-hero-copy">
            <p class="lzg-kicker"><span></span> PERSONAL FREQUENCY</p>
            <h1 id="lzg-title" class="lzg-title">{{ profile.site.name }}</h1>
            <p class="lzg-full-name">{{ profile.site.fullName }} <span>·</span> {{ profile.site.chineseName }}</p>
            <p class="lzg-hero-title">{{ profile.site.title }}</p>
            <p class="lzg-tagline">{{ profile.site.tagline }}</p>
            <a class="lzg-scroll-link" href="#about">Enter the signal <span aria-hidden="true">↘</span></a>
          </div>

          <div class="lzg-signal-stage" aria-hidden="true">
            <div class="lzg-signal-frame">
              <i class="lzg-signal-ribbon ribbon-one"></i>
              <i class="lzg-signal-ribbon ribbon-two"></i>
              <i class="lzg-signal-ribbon ribbon-three"></i>
              <span class="lzg-signal-coordinate coordinate-top">22.24 / LZG</span>
              <span class="lzg-signal-coordinate coordinate-bottom">SIGNAL FOUND</span>
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="lzg-section lzg-about" aria-labelledby="about-title">
        <div class="lzg-container lzg-about-layout">
          <p class="lzg-section-index">01 / ABOUT</p>
          <div class="lzg-about-content">
            <p class="lzg-kicker"><span></span> {{ profile.about.eyebrow }}</p>
            <h2 id="about-title" class="lzg-section-title">{{ profile.about.heading }}</h2>
            <p class="lzg-about-body">{{ profile.about.body }}</p>
          </div>
          <figure class="lzg-about-photo">
            <img :src="seasidePortrait" alt="Zonggui Li standing by the sea" />
            <figcaption>A moment kept in blue.</figcaption>
          </figure>
        </div>
      </section>

      <section id="now" class="lzg-section lzg-now" aria-labelledby="now-title">
        <div class="lzg-container">
          <div class="lzg-section-heading">
            <p class="lzg-section-index">02 / NOW</p>
            <h2 id="now-title" class="lzg-section-title lzg-section-title--compact">A few things, right now.</h2>
          </div>

          <div class="lzg-now-layout">
            <figure class="lzg-now-photo">
              <img :src="cityAvatar" alt="Zonggui Li reflected in a city street" />
              <figcaption>NOW / 001</figcaption>
            </figure>
            <div class="lzg-now-grid">
              <article v-for="item in profile.now" :key="item.label" class="lzg-now-card">
                <p class="lzg-now-label">{{ item.label }}</p>
                <h3>{{ item.value }}</h3>
                <p>{{ item.detail }}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="lzg-section lzg-contact" aria-labelledby="contact-title">
        <div class="lzg-container lzg-contact-layout">
          <p class="lzg-section-index">03 / CONTACT</p>
          <div class="lzg-contact-content">
            <p class="lzg-kicker"><span></span> OPEN, WHEN READY</p>
            <h2 id="contact-title" class="lzg-section-title">{{ profile.contact.heading }}</h2>
            <p class="lzg-contact-message">{{ profile.contact.message }}</p>
            <div v-if="profile.contact.social.length" class="lzg-social-links" aria-label="Social links">
              <a
                v-for="social in profile.contact.social"
                :key="social.label"
                :href="social.url"
                target="_blank"
                rel="noreferrer"
              >
                {{ social.label }} <span aria-hidden="true">↗</span>
              </a>
            </div>
            <p v-else class="lzg-contact-pending">CONTACT CHANNEL / PENDING</p>
          </div>
          <figure class="lzg-contact-photo">
            <img :src="walkingPortrait" alt="Zonggui Li walking in late afternoon light" />
            <figcaption>A WALK / 002</figcaption>
          </figure>
        </div>
      </section>
    </main>

    <footer class="lzg-footer">
      <div class="lzg-container lzg-footer-inner">
        <div class="lzg-footer-meta">
          <span>{{ profile.site.footer }}</span>
          <a
            class="lzg-filing-link"
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            浙ICP备2026019344号-2
          </a>
        </div>
        <span>{{ apiUnavailable ? 'LOCAL FALLBACK' : profile.site.version }}</span>
      </div>
    </footer>
  </div>
</template>

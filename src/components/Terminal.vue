<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import portfolioData from '../models/portfolio.json'

interface TerminalLine {
  text: string
  typed: boolean
  isCommand?: boolean
}

const prompt = portfolioData.profile.terminal.prompt
const lines = ref<TerminalLine[]>([])
const lineIndex = ref(0)
const charIndex = ref(0)
const isTyping = ref(false)
const showCursor = ref(true)

const commands = portfolioData.profile.terminal.commands
const introLines = portfolioData.profile.terminal.intro

// Combined lines: command, output, command, output, ...
const combinedLines: { text: string; isCommand: boolean }[] = []
commands.forEach((cmd, i) => {
  combinedLines.push({ text: cmd, isCommand: true })
  if (introLines[i]) {
    combinedLines.push({ text: introLines[i], isCommand: false })
  }
})

// Typing animation
const typeNextChar = () => {
  if (lineIndex.value < combinedLines.length) {
    const currentLineData = combinedLines[lineIndex.value]

    if (charIndex.value === 0) {
      // Add new line
      lines.value.push({
        text: '',
        typed: false,
        isCommand: currentLineData.isCommand
      })
    }

    if (charIndex.value < currentLineData.text.length) {
      const line = lines.value[lines.value.length - 1]
      line.text += currentLineData.text[charIndex.value]
      charIndex.value++
      setTimeout(typeNextChar, 30 + Math.random() * 50)
    } else {
      // Line complete
      const line = lines.value[lines.value.length - 1]
      line.typed = true
      charIndex.value = 0
      lineIndex.value++
      setTimeout(typeNextChar, 400)
    }
  } else {
    isTyping.value = false
  }
}

// Cursor blink
let cursorInterval: ReturnType<typeof setInterval>
onMounted(() => {
  isTyping.value = true
  setTimeout(typeNextChar, 500)

  cursorInterval = setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)
})

onUnmounted(() => {
  if (cursorInterval) {
    clearInterval(cursorInterval)
  }
})
</script>

<template>
  <div class="terminal-container">
    <div class="terminal-header">
      <div class="terminal-buttons">
        <span class="btn close"></span>
        <span class="btn minimize"></span>
        <span class="btn maximize"></span>
      </div>
      <div class="terminal-title">root@portfolio:~</div>
    </div>
    <div class="terminal-body">
      <div class="terminal-output">
        <div
          v-for="(line, index) in lines"
          :key="index"
          class="terminal-line"
          :class="{ command: line.isCommand }"
        >
          <span v-if="line.isCommand" class="prompt">{{ prompt }}</span>
          <span>{{ line.text }}</span>
        </div>
        <div class="terminal-line current">
          <span class="prompt">{{ prompt }}</span>
          <span class="cursor" :class="{ visible: showCursor }">_</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-container {
  width: 100%;
  max-width: 900px;
  height: 500px;
  background: #0a0a0f;
  border-radius: 12px;
  border: 1px solid rgba(170, 59, 255, 0.3);
  box-shadow: 0 0 60px rgba(170, 59, 255, 0.25),
              0 0 120px rgba(0, 0, 0, 0.6),
              inset 0 0 60px rgba(170, 59, 255, 0.05);
  overflow: hidden;
}

.terminal-header {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  background: rgba(20, 18, 30, 0.95);
  border-bottom: 1px solid rgba(170, 59, 255, 0.2);
}

.terminal-buttons {
  display: flex;
  gap: 10px;
}

.terminal-buttons .btn {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.terminal-buttons .btn.close {
  background: #ff5f57;
}

.terminal-buttons .btn.minimize {
  background: #febc2e;
}

.terminal-buttons .btn.maximize {
  background: #28c840;
}

.terminal-title {
  margin-left: 20px;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 14px;
  color: var(--text-muted, #6b6b8a);
}

.terminal-body {
  padding: 28px;
  height: calc(100% - 52px);
  overflow-y: auto;
}

.terminal-body::-webkit-scrollbar {
  width: 8px;
}

.terminal-body::-webkit-scrollbar-track {
  background: rgba(10, 10, 15, 0.5);
}

.terminal-body::-webkit-scrollbar-thumb {
  background: rgba(170, 59, 255, 0.3);
  border-radius: 4px;
}

.terminal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(170, 59, 255, 0.5);
}

.terminal-output {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 16px;
  line-height: 1.8;
}

.terminal-line {
  margin-bottom: 8px;
  color: var(--text, #a0a0c0);
  word-break: break-word;
  white-space: pre-wrap;
}

.terminal-line.command .prompt {
  color: var(--accent, #aa3bff);
}

.prompt {
  margin-right: 10px;
  color: var(--accent-secondary, #00d4ff);
  font-weight: 500;
}

.cursor {
  display: inline-block;
  width: 10px;
  height: 20px;
  background: var(--accent, #aa3bff);
  opacity: 0;
  transition: opacity 0.1s;
  vertical-align: middle;
  margin-left: 2px;
  box-shadow: 0 0 10px var(--accent, #aa3bff);
}

.cursor.visible {
  opacity: 1;
}

/* Glowing effect for typed text */
.terminal-line:not(.command) {
  text-shadow: 0 0 10px rgba(170, 59, 255, 0.3);
}

@media (max-width: 1024px) {
  .terminal-container {
    max-width: 100%;
    height: 400px;
  }

  .terminal-body {
    padding: 20px;
  }

  .terminal-output {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .terminal-container {
    height: 350px;
  }

  .terminal-body {
    padding: 16px;
  }

  .terminal-output {
    font-size: 13px;
  }

  .terminal-header {
    padding: 12px 16px;
  }

  .terminal-title {
    font-size: 12px;
  }
}
</style>

<script setup>
import { ref, computed } from 'vue'
import heroLogo from '@/assets/openthistext.png'

const query = ref('')
const messages = ref([]) // { role: 'user'|'assistant', text: string }
const isResponding = ref(false)

const lastAssistant = computed(() => {
  for (let i = messages.value.length - 1; i >= 0; i--) {
    if (messages.value[i].role === 'assistant') return messages.value[i].text
  }
  return ''
})

const hintChips = [
  { label: 'Courses', text: 'Show me available courses' },
  { label: 'Clubs', text: 'List student clubs and activities' },
  { label: 'Stats', text: 'Show school statistics' },
  { label: 'Announcements', text: 'Show the latest announcements' },
]

function applyHint(text) {
  query.value = text
}

function generateMockResponse(q) {
  return `Here’s a mock answer about “${q}”.\n\n- Key info 1\n- Key info 2\n\nWant to refine your question?`
}

function run() {
  const q = query.value.trim()
  if (!q) return
  messages.value.push({ role: 'user', text: q })
  isResponding.value = true

  const reply = generateMockResponse(q)
  setTimeout(() => {
    messages.value.push({ role: 'assistant', text: reply })
    isResponding.value = false
  }, 400)
}

function clearAll() {
  messages.value = []
  isResponding.value = false
}
</script>

<template>
  <section class="relative overflow-hidden bg-base-100">
    <!-- Background pattern + subtle radial vignette -->
    <div class="absolute inset-0 -z-10 bg-grid bg-radial-fade"></div>
    <div class="absolute -top-32 left-1/2 -translate-x-1/2 -z-10 w-[80rem] h-[40rem] rounded-full opacity-[0.07] pointer-events-none"
         style="background: radial-gradient(closest-side, var(--color-base-content), transparent 70%);"></div>

    <div class="hero py-16">
      <div class="hero-content text-center px-6">
        <div class="max-w-4xl">
          <div class="mb-6 flex justify-center">
            <img :src="heroLogo" alt="OpenTHIS" class="h-14 lg:h-20 w-auto" />
          </div>
          
          <!-- Assistant input -->
          <div class="max-w-4xl mx-auto mb-12 py-8">
            <label class="text-sm text-base-content/60 sr-only">Ask the assistant</label>
            <div class="relative w-full">
              <input
                v-model="query"
                @keyup.enter="run"
                type="text"
                class="input input-bordered w-full pr-16 py-6 text-base rounded-4xl border-1 shadow-sm focus:shadow-md transition-shadow focus:border-primary focus:outline-none"
                placeholder="What can I help you with today?"
                autocomplete="off"
              />
              <div class="absolute right-2 inset-y-0 flex items-center z-10">
                <button 
                  class="btn btn-circle btn-primary btn-sm" 
                  @click="run" 
                  aria-label="Send"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L12 20M5 9L12 2L19 9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <!-- Directly under the text box: original container with only response/loader -->
            <div v-if="isResponding || lastAssistant" class="mt-3">
              <div class="bg-base-100 border-1 border-base-300 rounded-2xl shadow-sm">
                <div class="px-4 py-3 relative">
                  <button type="button" class="btn btn-ghost btn-xs absolute top-2 right-2" @click="clearAll">Clear</button>
                  <div v-if="isResponding" class="text-left">
                    <span class="loading loading-dots loading-sm"></span>
                  </div>
                  <div v-else class="whitespace-pre-wrap text-sm leading-relaxed text-base-content/80 text-left">
                    {{ lastAssistant }}
                  </div>
                </div>
              </div>
            </div>
            <!-- Hint chips below the box -->
            <div v-if="!isResponding && messages.length === 0" class="mt-4 flex flex-wrap gap-2 justify-center">
              <button
                v-for="hint in hintChips"
                :key="hint.label"
                type="button"
                class="px-4 py-2 rounded-full border border-base-300 bg-base-100 shadow-sm text-sm hover:bg-base-200 cursor-pointer hover:cursor-pointer"
                @click="applyHint(hint.text)"
              >
                {{ hint.label }}
              </button>
            </div>
          </div>
          <p class="text-lg text-base-content/70 mb-3">Tsinghua International School</p>
          <p class="text-base text-base-content/60 mb-10 max-w-xl mx-auto">
            A modern, globally minded community offering the IB Diploma and AP courses,
            with a focus on academic excellence and student well‑being.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <RouterLink to="/courses" class="btn btn-primary">View Courses</RouterLink>
            <RouterLink to="/schedule" class="btn btn-outline">View Schedule</RouterLink>
          </div>

          <div class="stats stats-vertical lg:stats-horizontal bg-base-100 border border-base-300 rounded-xl shadow-sm">
            <div class="stat">
              <div class="stat-figure text-primary">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <div class="stat-title">Students</div>
              <div class="stat-value text-primary">1,200+</div>
              <div class="stat-desc">Active learners</div>
            </div>

            <div class="stat">
              <div class="stat-figure text-secondary">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="stat-title">Faculty</div>
              <div class="stat-value text-secondary">150+</div>
              <div class="stat-desc">Expert educators</div>
            </div>

            <div class="stat">
              <div class="stat-figure text-accent">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 2a1 1 0 01.894.553l1.382 2.763 3.05.443a1 1 0 01.554 1.706l-2.206 2.15.521 3.037a1 1 0 01-1.451 1.054L12 12.347l-2.744 1.441a1 1 0 01-1.451-1.054l.521-3.037-2.206-2.15a1 1 0 01.554-1.706l3.05-.443L11.106 2.553A1 1 0 0112 2z"/>
                </svg>
              </div>
              <div class="stat-title">Nationalities</div>
              <div class="stat-value text-accent">60+</div>
              <div class="stat-desc">Global student body</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

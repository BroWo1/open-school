<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  course: { type: Object, default: null }
})

const emit = defineEmits(['close'])

// Comments state persisted per-course in localStorage
const comments = ref([])
const author = ref('')
const message = ref('')

const storageKey = computed(() => props.course ? `course-comments-${props.course.id}` : '')

function loadComments() {
  if (!storageKey.value) return
  try {
    const saved = localStorage.getItem(storageKey.value)
    comments.value = saved ? JSON.parse(saved) : []
  } catch {
    comments.value = []
  }
}

function saveComments() {
  if (!storageKey.value) return
  try {
    localStorage.setItem(storageKey.value, JSON.stringify(comments.value))
  } catch {
    // ignore
  }
}

watch(() => props.course, () => {
  loadComments()
})

function addComment() {
  if (!author.value.trim() || !message.value.trim()) return
  comments.value.unshift({
    id: Date.now(),
    author: author.value.trim(),
    message: message.value.trim(),
    date: new Date().toISOString()
  })
  author.value = ''
  message.value = ''
  saveComments()
}

function removeComment(id) {
  comments.value = comments.value.filter(c => c.id !== id)
  saveComments()
}

// Curriculum topics by subject fallback
const curriculumTopics = computed(() => {
  if (!props.course) return []
  const subject = props.course.subject
  const map = {
    Math: [
      'Algebraic foundations',
      'Calculus: limits, derivatives, integrals',
      'Linear algebra basics',
      'Series and sequences',
      'Differential equations overview'
    ],
    Science: [
      'Scientific method and inquiry',
      'Ecosystems and energy flow',
      'Data analysis and modeling',
      'Lab safety and experimentation',
      'Systems thinking'
    ],
    Language: [
      'Grammar and composition',
      'Reading and analysis',
      'Creative writing techniques',
      'Research and citation',
      'Presentation and critique'
    ]
  }
  return map[subject] || [
    'Course overview and expectations',
    'Core concepts and skills',
    'Applied practice and projects',
    'Assessment preparation',
    'Final review'
  ]
})

// Grade distribution based on difficulty level
const gradeDist = computed(() => {
  if (!props.course) return []
  const level = props.course.level
  const byLevel = {
    Beginner: { A: 45, B: 35, C: 15, D: 4, F: 1 },
    Intermediate: { A: 35, B: 40, C: 20, D: 4, F: 1 },
    Advanced: { A: 25, B: 40, C: 25, D: 8, F: 2 }
  }
  const dist = byLevel[level] || byLevel.Intermediate
  return Object.entries(dist).map(([grade, pct]) => ({ grade, pct }))
})

const passRate = computed(() => {
  const entry = gradeDist.value.reduce((acc, g) => ({ ...acc, [g.grade]: g.pct }), {})
  return (entry.A || 0) + (entry.B || 0) + (entry.C || 0)
})

const avgCapacity = computed(() => {
  if (!props.course) return 0
  return Math.round((props.course.enrolled / props.course.capacity) * 100)
})

function closeModal() {
  emit('close')
}
</script>

<template>
  <Transition name="fade-zoom">
  <div v-if="open && course" class="modal modal-open">
    <div class="modal-box max-w-6xl p-0 overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-base-300 flex items-start justify-between bg-base-100">
        <div>
          <div class="flex items-center gap-3">
            <h3 class="text-xl font-semibold">{{ course.name }}</h3>
            <div class="badge" :class="{
              'badge-success': course.level === 'Beginner',
              'badge-warning': course.level === 'Intermediate',
              'badge-error': course.level === 'Advanced'
            }">{{ course.level }}</div>
          </div>
          <div class="text-sm text-base-content/70 flex items-center gap-3 mt-1">
            <span>Instructor: {{ course.instructor }}</span>
            <span class="hidden md:inline">•</span>
            <span class="hidden md:inline">{{ course.schedule }}</span>
            <span class="hidden md:inline">•</span>
            <span class="hidden md:inline">Room {{ course.room }}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" @click="closeModal">✕</button>
      </div>

      <!-- Body: two columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <!-- Left: curriculum + grades -->
        <div class="lg:col-span-2 p-6 space-y-6 bg-base-100">
          <!-- Course description -->
          <div class="prose max-w-none">
            <p class="text-base-content/80">{{ course.description }}</p>
          </div>

          <!-- Quick stats -->
          <div class="grid grid-cols-3 gap-3">
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">Enrollment</div>
              <div class="stat-value text-lg">{{ course.enrolled }}/{{ course.capacity }}</div>
              <div class="stat-desc text-xs">{{ avgCapacity }}% capacity</div>
            </div>
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">Duration</div>
              <div class="stat-value text-lg">{{ course.duration }}</div>
              <div class="stat-desc text-xs">Elective {{ course.electiveGroup }}</div>
            </div>
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">Pass Rate</div>
              <div class="stat-value text-lg">{{ passRate }}%</div>
              <div class="stat-desc text-xs">Based on historical data</div>
            </div>
          </div>

          <!-- Curriculum -->
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body p-5">
              <h4 class="card-title text-base">Curriculum Overview</h4>
              <ul class="list-disc pl-5 text-sm text-base-content/80 space-y-1 mt-2">
                <li v-for="(topic, idx) in curriculumTopics" :key="idx">{{ topic }}</li>
              </ul>
            </div>
          </div>

          <!-- Grade distribution -->
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body p-5">
              <h4 class="card-title text-base">Grade Distribution</h4>
              <!-- Stacked bars -->
              <div class="mt-3 space-y-2">
                <div class="w-full bg-base-200 rounded h-4 overflow-hidden">
                  <div class="h-4 flex">
                    <div v-for="g in gradeDist" :key="g.grade"
                         :style="{ width: g.pct + '%'}"
                         :class="[
                           'h-full',
                           g.grade === 'A' ? 'bg-green-500' : '',
                           g.grade === 'B' ? 'bg-emerald-400' : '',
                           g.grade === 'C' ? 'bg-yellow-400' : '',
                           g.grade === 'D' ? 'bg-orange-400' : '',
                           g.grade === 'F' ? 'bg-red-500' : ''
                         ]"
                    />
                  </div>
                </div>
                <div class="flex flex-wrap gap-3 text-xs text-base-content/70">
                  <div v-for="g in gradeDist" :key="g.grade" class="flex items-center gap-1">
                    <span :class="[
                      'inline-block w-3 h-3 rounded',
                      g.grade === 'A' ? 'bg-green-500' : '',
                      g.grade === 'B' ? 'bg-emerald-400' : '',
                      g.grade === 'C' ? 'bg-yellow-400' : '',
                      g.grade === 'D' ? 'bg-orange-400' : '',
                      g.grade === 'F' ? 'bg-red-500' : ''
                    ]"></span>
                    <span>{{ g.grade }}: {{ g.pct }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: comments/announcements -->
        <div class="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-base-300 bg-base-50 p-6">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold">Course Announcements & Comments</h4>
            <span class="badge badge-ghost">{{ comments.length }}</span>
          </div>

          <!-- New comment form -->
          <div class="space-y-2 mb-4">
            <input v-model="author" type="text" placeholder="Your name" class="input input-bordered input-sm w-full" />
            <textarea v-model="message" rows="3" placeholder="Share an announcement or comment..." class="textarea textarea-bordered w-full"></textarea>
            <div class="flex justify-end">
              <button class="btn btn-primary btn-sm" :disabled="!author.trim() || !message.trim()" @click="addComment">Post</button>
            </div>
          </div>

          <!-- Comments list -->
          <div class="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
            <div v-if="comments.length === 0" class="text-sm text-base-content/60">No posts yet. Be the first to share.</div>
            <div v-for="c in comments" :key="c.id" class="p-3 rounded border border-base-300 bg-base-100">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium">{{ c.author }}</div>
                <button class="btn btn-ghost btn-xs" @click="removeComment(c.id)">Delete</button>
              </div>
              <div class="text-xs text-base-content/60 mb-1">{{ new Date(c.date).toLocaleString() }}</div>
              <div class="text-sm whitespace-pre-wrap">{{ c.message }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-action px-6 py-4 border-t border-base-300 bg-base-100">
        <button class="btn" @click="closeModal">Close</button>
      </div>
    </div>
    <div class="modal-backdrop" @click="closeModal"></div>
  </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
}

/* Open/close animation */
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: opacity 200ms ease;
}
.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
}
.fade-zoom-enter-active .modal-box,
.fade-zoom-leave-active .modal-box {
  transition: transform 200ms ease, opacity 200ms ease;
}
.fade-zoom-enter-from .modal-box,
.fade-zoom-leave-to .modal-box {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>

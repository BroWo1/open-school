<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { useCourses } from '../composables/useCourses.js'
import { useClubs } from '../composables/useClubs.js'

// Config
const days = [
  { id: 1, label: 'Day 1' },
  { id: 2, label: 'Day 2' },
  { id: 3, label: 'Day 3' },
  { id: 4, label: 'Day 4' },
  { id: 5, label: 'Day 5' },
  { id: 6, label: 'Day 6' },
]
const periods = [1, 2, 3, 4]

// Get courses from shared source
const { courses } = useCourses()
const classes = courses
const classById = Object.fromEntries(classes.map(c => [c.id, c]))

// Clubs source
const { clubsRef } = useClubs()
const clubs = clubsRef
const clubById = computed(() => Object.fromEntries(clubs.value.map(c => [c.id, c])))

// Currently selected grid block
const selectedBlock = ref({ dayIdx: null, periodIdx: null })
const pickerOpen = ref(false)
const pickerPos = ref({ top: 0, left: 0, width: 0 })
const gridRef = ref(null)
const cellEls = ref({})
const headerEls = ref({})
const setCellEl = (dIdx, pIdx) => (el) => {
  if (el) cellEls.value[`${dIdx}-${pIdx}`] = el
}
const setHeaderEl = (dIdx) => (el) => {
  if (el) headerEls.value[`${dIdx}`] = el
}

// My Courses functionality for filtering
function loadMyCourses() {
  try {
    const saved = localStorage.getItem('my-courses')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const myCourses = ref(loadMyCourses())

function saveMyCourses() {
  try {
    localStorage.setItem('my-courses', JSON.stringify(myCourses.value))
  } catch (error) {
    console.warn('Failed to save my courses:', error)
  }
}

watch(myCourses, () => {
  saveMyCourses()
}, { deep: true })

function toggleCourseInMyCourses(courseId) {
  const index = myCourses.value.indexOf(courseId)
  if (index === -1) {
    myCourses.value.push(courseId)
  } else {
    myCourses.value.splice(index, 1)
  }
}

const myCoursesObjects = computed(() => {
  return myCourses.value
    .map(id => classes.find(c => c.id === id))
    .filter(Boolean)
})

// Lock state (prevents schedule changes)
function loadLock() {
  try {
    return localStorage.getItem('schedule-locked') === 'true'
  } catch {
    return false
  }
}
const isLocked = ref(loadLock())
function saveLock() {
  try { localStorage.setItem('schedule-locked', String(isLocked.value)) } catch {}
}
watch(isLocked, saveLock)
function toggleLock() {
  isLocked.value = !isLocked.value
  if (isLocked.value) pickerOpen.value = false
  pushToast(isLocked.value ? 'Schedule locked' : 'Schedule unlocked', isLocked.value ? 'warning' : 'success', 1500)
}

// Toast notifications (for lock/unlock)
const toasts = ref([])
function pushToast(message, type = 'info', ms = 1500) {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, ms)
}

function addCourseFromPanel(courseId) {
  if (isLocked.value) { pushToast('Schedule is locked', 'warning', 1500); return }
  addCourseById(courseId)
}

// My Clubs functionality (shared with Clubs page)
function loadMyClubs() {
  try {
    const saved = localStorage.getItem('my-clubs')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}
const myClubs = ref(loadMyClubs())
function saveMyClubs() {
  try {
    localStorage.setItem('my-clubs', JSON.stringify(myClubs.value))
  } catch (e) {
    console.warn('Failed to save my clubs:', e)
  }
}
watch(myClubs, saveMyClubs, { deep: true })
const myClubsObjects = computed(() => myClubs.value
  .map(id => clubs.value.find(c => c.id === id))
  .filter(Boolean))

// Day clubs assignments (per day, list of club IDs)
function loadDayClubs() {
  try {
    const saved = localStorage.getItem('schedule-day-clubs')
    return saved ? JSON.parse(saved) : Array.from({ length: 6 }, () => [])
  } catch {
    return Array.from({ length: 6 }, () => [])
  }
}
const dayClubs = ref(loadDayClubs())
function saveDayClubs() {
  try {
    localStorage.setItem('schedule-day-clubs', JSON.stringify(dayClubs.value))
  } catch (e) {
    console.warn('Failed to save day clubs:', e)
  }
}
watch(dayClubs, saveDayClubs, { deep: true })

function addClubToDay(dayIdx, clubId) {
  const list = dayClubs.value[dayIdx]
  if (!list.includes(clubId)) list.push(clubId)
}
function removeClubFromDay(dayIdx, clubId) {
  const list = dayClubs.value[dayIdx]
  const idx = list.indexOf(clubId)
  if (idx !== -1) list.splice(idx, 1)
}
function addClubFromPanel(clubId) {
  const { dayIdx } = selectedBlock.value
  if (dayIdx == null) {
    showAlert('Select a day slot first, then click a club to add it', 'info')
    return
  }
  if (isLocked.value) { pushToast('Schedule is locked', 'warning', 1500); return }
  addClubToDay(dayIdx, clubId)
}

// Load saved schedule or create new one
function loadSchedule() {
  try {
    const saved = localStorage.getItem('schedule-assignments')
    return saved ? JSON.parse(saved) : Array.from({ length: 6 }, () => Array.from({ length: 4 }, () => []))
  } catch {
    return Array.from({ length: 6 }, () => Array.from({ length: 4 }, () => []))
  }
}

// Schedule assignments: 6 days x 4 periods → array of courseIds (allow overflow/conflicts)
const assignments = ref(loadSchedule())

// Auto-save functionality
function saveSchedule() {
  try {
    localStorage.setItem('schedule-assignments', JSON.stringify(assignments.value))
  } catch (error) {
    console.warn('Failed to save schedule:', error)
  }
}

// Watch for changes and auto-save
watch(assignments, () => {
  saveSchedule()
}, { deep: true })


// Alerts
const alertMsg = ref('')
const alertType = ref('warning') // info | success | warning | error
let alertTimer = null
function showAlert(msg, type = 'warning', ms = 2200) {
  alertMsg.value = msg
  alertType.value = type
  clearTimeout(alertTimer)
  alertTimer = setTimeout(() => (alertMsg.value = ''), ms)
}


function positionPicker(dayIndex, periodIndex) {
  const gridEl = gridRef.value
  const cellEl = periodIndex != null
    ? cellEls.value[`${dayIndex}-${periodIndex}`]
    : headerEls.value[`${dayIndex}`]
  if (!gridEl || !cellEl) return
  const g = gridEl.getBoundingClientRect()
  const r = cellEl.getBoundingClientRect()
  pickerPos.value = {
    top: r.bottom - g.top + 8,
    left: r.left - g.left,
    width: r.width,
  }
}

function toggleSlot(dayIndex, periodIndex) {
  if (isLocked.value) { pushToast('Schedule is locked', 'warning', 1500); return }
  selectedBlock.value = { dayIdx: dayIndex, periodIdx: periodIndex }
  nextTick(() => positionPicker(dayIndex, periodIndex))
  pickerOpen.value = true
}

function openDayPicker(dayIndex) {
  if (isLocked.value) { pushToast('Schedule is locked', 'warning', 1500); return }
  selectedBlock.value = { dayIdx: dayIndex, periodIdx: null }
  nextTick(() => positionPicker(dayIndex, null))
  pickerOpen.value = true
}

function onResize() {
  if (!pickerOpen.value) return
  const { dayIdx, periodIdx } = selectedBlock.value
  if (dayIdx != null) positionPicker(dayIdx, periodIdx)
}
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

const eligibleClasses = computed(() => {
  const { dayIdx, periodIdx } = selectedBlock.value
  if (dayIdx == null || periodIdx == null) return []
  const day = dayIdx + 1
  const period = periodIdx + 1
  // Only show courses that are in "My Courses" and are eligible for this time slot
  return classes.filter(c => 
    myCourses.value.includes(c.id) && 
    c.pattern.some(b => b.day === day && b.period === period)
  )
})

// Horizontal grid divider positions (between day rows)
// Based on fixed row height h-32 (128px) and gap-3 (12px)
const ROW_HEIGHT = 128
const ROW_GAP = 12
const dividerPositions = computed(() =>
  Array.from({ length: days.length - 1 }, (_, i) => ROW_HEIGHT * (i + 1) + ROW_GAP * i + ROW_GAP / 2)
)

function addCourseById(cid) {
  if (isLocked.value) { pushToast('Schedule is locked', 'warning', 1500); return }
  const course = classById[cid]
  if (!course) return
  course.pattern.forEach(({ day, period }) => {
    const list = assignments.value[day - 1][period - 1]
    if (!list.includes(cid)) list.push(cid)
  })
  // No alert message - silent addition
}

function clearBlock(dayIndex, periodIndex) {
  if (isLocked.value) { pushToast('Schedule is locked', 'warning', 1500); return }
  const currentCourses = [...assignments.value[dayIndex][periodIndex]]
  currentCourses.forEach(cid => {
    const course = classById[cid]
    if (course) {
      // Remove this course from all its scheduled blocks
      course.pattern.forEach(({ day, period }) => {
        const list = assignments.value[day - 1][period - 1]
        const index = list.indexOf(cid)
        if (index !== -1) list.splice(index, 1)
      })
    }
  })
}

function clearAll() {
  if (isLocked.value) { pushToast('Schedule is locked', 'warning', 1500); return }
  assignments.value = Array.from({ length: 6 }, () => Array.from({ length: 4 }, () => []))
  saveSchedule()
  showAlert('Schedule cleared', 'info')
}

function exportJSON() {
  const data = assignments.value.map((day, d) => day.map((list, p) => list.map(cid => ({ day: d + 1, period: p + 1, class: classById[cid].name, classId: cid }))))
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'schedule.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="container mx-auto max-w-7xl px-6 py-16 relative">
    <div class="mb-6 text-center">
      <h1 class="text-4xl font-bold text-base-content mb-2">Schedule</h1>
      <p class="text-base text-base-content/70">6-day cycle • 4 periods per day • One period per day per class</p>
    </div>

    <div v-if="alertMsg" class="mb-4">
      <div :class="['alert', `alert-${alertType}`]">
        <span>{{ alertMsg }}</span>
      </div>
    </div>

    <!-- Schedule + My Courses -->
    <div class="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Left: Schedule Grid -->
      <div class="lg:col-span-3">
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body relative">
            <div class="flex items-center justify-between mb-3">
              <div class="text-xs text-base-content/60">Select cells to add courses; select day headers to add clubs.</div>
              <button class="btn btn-sm" :class="isLocked ? 'btn-warning' : 'btn-ghost'" @click="toggleLock">
                <span v-if="isLocked">🔒 Locked</span>
                <span v-else>🔓 Lock Changes</span>
              </button>
            </div>
            <!-- Header row with period labels -->
            <div class="grid grid-cols-5 gap-4 mb-4">
              <div></div>
              <div
                v-for="(p, pIdx) in periods"
                :key="p"
                class="relative text-center text-base font-medium text-base-content"
              >
                Period {{ p }}
              </div>
            </div>

            <!-- Grid: label column (days) + 4 period columns -->
            <div class="relative grid grid-cols-5 gap-4" ref="gridRef">
              <!-- Overlay horizontal dividers centered in row gaps -->
              <div class="pointer-events-none absolute inset-0 z-0">
                <div
                  v-for="(top, i) in dividerPositions"
                  :key="i"
                  class="absolute left-0 right-0 h-px bg-base-300"
                  :style="{ top: top + 'px' }"
                />
              </div>
              <!-- Day labels -->
              <div class="relative z-10 grid grid-rows-6 gap-3">
                <div 
                  v-for="(d, dIdx) in days" 
                  :key="d.id" 
                  :class="[
                    'rounded-lg border border-dashed border-base-300 h-32 p-2 flex flex-col transition-colors',
                    isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:border-primary hover:bg-primary/5'
                  ]"
                  :ref="setHeaderEl(dIdx)"
                  @click="openDayPicker(dIdx)"
                >
                  <div class="text-sm font-medium text-base-content/80 text-center">{{ d.label }}</div>
                  <div class="mt-2 flex flex-wrap gap-1 justify-center overflow-hidden">
                    <span 
                      v-for="cid in dayClubs[dIdx]" 
                      :key="cid"
                      class="badge badge-ghost badge-xs flex items-center gap-1">
                      <span class="truncate max-w-[80px]">{{ clubById[cid]?.name || ('Club #' + cid) }}</span>
                      <button class="btn btn-ghost btn-xs p-0 min-h-0 h-4" title="Remove" :disabled="isLocked" @click.stop="!isLocked && removeClubFromDay(dIdx, cid)">✕</button>
                    </span>
                    <span v-if="dayClubs[dIdx].length === 0" class="text-[10px] text-base-content/40">No clubs</span>
                  </div>
                </div>
              </div>

              <!-- Period columns -->
              <div
                v-for="(p, pIdx) in periods"
                :key="p"
                class="relative z-10 grid grid-rows-6 gap-3"
              >
                <div
                  v-for="(day, dIdx) in days"
                  :key="day.id"
                  :class="[
                    'rounded-lg bg-base-100 transition-colors h-32 border overflow-hidden relative',
                    isLocked ? 'cursor-not-allowed' : 'cursor-pointer',
                    assignments[dIdx][pIdx].length > 1 ? 'border-error' : 'border-base-300 hover:border-base-400',
                    selectedBlock.dayIdx === dIdx && selectedBlock.periodIdx === pIdx ? 'ring-2 ring-primary' : ''
                  ]"
                  :ref="setCellEl(dIdx, pIdx)"
                  @click="toggleSlot(dIdx, pIdx)"
                >
                  <div v-if="assignments[dIdx][pIdx].length" class="absolute inset-0 rounded-lg overflow-hidden">
                    <div class="h-full space-y-0">
                      <div v-for="cid in assignments[dIdx][pIdx]" :key="cid" class="bg-base-300/50 text-base-content h-full flex flex-col justify-center text-center p-2">
                        <div class="font-bold text-sm mb-1">{{ classById[cid].name }}</div>
                        <div class="text-xs opacity-70">
                          {{ classById[cid].instructor }}
                        </div>
                        <div class="text-xs opacity-70">
                          {{ classById[cid].room }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="absolute inset-0 flex items-center justify-center text-xs text-base-content/50">— blank —</div>
                </div>
              </div>
            </div>

            <!-- Inline picker under the selected block -->
            <Transition 
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95 translate-y-[-10px]"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-[-10px]">
              <div v-if="pickerOpen && selectedBlock.dayIdx != null" class="absolute z-20" :style="{ top: pickerPos.top + 'px', left: pickerPos.left + 'px', minWidth: '320px' }">
                <div class="card border border-base-300 bg-base-100 shadow-xl">
                  <div class="card-body p-3">
                    <div class="text-sm font-medium text-base-content mb-3">Day {{ selectedBlock.dayIdx + 1 }}<template v-if="selectedBlock.periodIdx != null">, Period {{ selectedBlock.periodIdx + 1 }}</template></div>
                    
                    <!-- Clear block option (only for period cells) -->
                    <div v-if="selectedBlock.periodIdx != null && assignments[selectedBlock.dayIdx][selectedBlock.periodIdx].length > 0" class="mb-3">
                      <button class="btn btn-outline btn-error btn-sm w-full" @click.stop="clearBlock(selectedBlock.dayIdx, selectedBlock.periodIdx); pickerOpen = false">
                        Clear Block
                      </button>
                    </div>
                    
                    <!-- Course picker: only when a period cell is selected -->
                    <template v-if="selectedBlock.periodIdx != null">
                      <div class="text-xs text-base-content/70 mb-2">Add course from My Courses:</div>
                      <div v-if="eligibleClasses.length === 0" class="text-center text-sm text-base-content/50 py-6">
                        No courses from "My Courses" are available for this time slot.
                        <br>
                        <span class="text-xs">Go to Courses page to select courses first.</span>
                      </div>
                      <div v-else class="max-h-64 overflow-y-auto space-y-2">
                        <div v-for="c in eligibleClasses" :key="c.id" 
                             class="p-3 rounded-lg border border-base-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors" 
                             @click.stop="addCourseById(c.id); pickerOpen = false">
                          <div class="font-semibold text-sm text-base-content mb-1">{{ c.name }}</div>
                          <div class="text-xs text-base-content/70">{{ c.instructor }} • {{ c.room }}</div>
                        </div>
                      </div>
                    </template>

                    <!-- Club picker: only when a day header is selected -->
                    <template v-else>
                      <div class="text-xs text-base-content/70 mb-2">Add club from My Clubs (for Day {{ selectedBlock.dayIdx + 1 }}):</div>
                      <div v-if="myClubsObjects.length === 0" class="text-center text-sm text-base-content/50 py-4">
                        No clubs in "My Clubs". Go to Clubs page to select clubs.
                      </div>
                      <div v-else class="max-h-40 overflow-y-auto space-y-2">
                        <div v-for="club in myClubsObjects" :key="club.id"
                             class="p-2 rounded-lg border border-base-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors"
                             @click.stop="addClubToDay(selectedBlock.dayIdx, club.id); pickerOpen = false">
                          <div class="font-medium text-sm text-base-content mb-0.5">{{ club.name }}</div>
                          <div class="text-xs text-base-content/70">Advisor: {{ club.advisor }}</div>
                        </div>
                      </div>
                    </template>
                    
                    <div class="flex justify-end gap-2 mt-3">
                      <button class="btn btn-ghost btn-xs" @click.stop="pickerOpen = false">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Right: My Courses + My Clubs Panel (always visible) -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 border border-base-300 sticky top-6">
          <div class="card-body">
            <div class="flex items-center justify-between mb-2">
              <h2 class="card-title text-base-content">My Courses</h2>
            </div>
            <div class="mb-4">
              <h3 class="text-sm font-medium text-base-content/70 mb-2">Selected Courses ({{ myCourses.length }})</h3>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div 
                  v-for="course in myCoursesObjects" 
                  :key="course.id" 
                  :class="[
                    'p-2 rounded border border-base-300 bg-base-50 transition-colors',
                    isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-primary hover:bg-primary/5'
                  ]"
                  @click="addCourseFromPanel(course.id)"
                  :title="isLocked ? 'Schedule is locked' : 'Click to add this course to your schedule'"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-medium truncate">{{ course.name }}</div>
                      <div class="text-[10px] text-base-content/60 truncate">{{ course.instructor }}</div>
                    </div>
                    <button class="btn btn-ghost btn-xs text-error" @click.stop="toggleCourseInMyCourses(course.id)">✕</button>
                  </div>
                </div>
                <div v-if="myCourses.length === 0" class="text-center text-xs text-base-content/50 py-4">
                  No courses selected
                </div>
              </div>
            </div>

            <div>
              <RouterLink to="/courses" class="btn btn-primary w-full">Add More Courses</RouterLink>
              <div class="text-xs text-base-content/60 mt-2 text-center">Click a course here to add it to the schedule, or click a slot to pick eligible courses.</div>
            </div>

            <div class="divider my-6">My Clubs</div>

            <div class="mb-3">
              <h3 class="text-sm font-medium text-base-content/70 mb-2">Selected Clubs ({{ myClubs.length }})</h3>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div 
                  v-for="club in myClubsObjects" 
                  :key="club.id" 
                  :class="[
                    'p-2 rounded border border-base-300 bg-base-50 transition-colors',
                    isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-primary hover:bg-primary/5'
                  ]"
                  @click="addClubFromPanel(club.id)"
                  :title="isLocked ? 'Schedule is locked' : 'Click to add this club to the selected day'"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-medium truncate">{{ club.name }}</div>
                      <div class="text-[10px] text-base-content/60 truncate">Advisor: {{ club.advisor }}</div>
                    </div>
                    <button class="btn btn-ghost btn-xs text-error" @click.stop="myClubs = myClubs.filter(id => id !== club.id)">✕</button>
                  </div>
                </div>
                <div v-if="myClubs.length === 0" class="text-center text-xs text-base-content/50 py-4">
                  No clubs selected
                </div>
              </div>
            </div>

            <div>
              <RouterLink to="/clubs" class="btn btn-ghost w-full">Add More Clubs</RouterLink>
              <div class="text-xs text-base-content/60 mt-2 text-center">Select a day first, then click a club to attach it to that day.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Action buttons -->
    <div class="flex justify-center gap-4 mt-6">
      <button class="btn btn-outline" :disabled="isLocked" @click="clearAll">Clear All</button>
      <button class="btn btn-ghost" @click="exportJSON">Export Schedule</button>
    </div>

    <!-- Toasts (top, offset below sticky header) -->
    <div v-if="toasts.length" class="toast toast-top toast-center z-[60]" :style="{ top: '5rem' }">
      <div v-for="t in toasts" :key="t.id" :class="['alert', `alert-${t.type}`]">
        <span>{{ t.message }}</span>
      </div>
    </div>
  </div>
</template>

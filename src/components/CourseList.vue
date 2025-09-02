<script setup>
import { ref, computed, watch } from 'vue'
import { useCourses } from '../composables/useCourses.js'
import { useRouter } from 'vue-router'
import CourseDetailsModal from './CourseDetailsModal.vue'

const { coursesRef } = useCourses()
const courses = coursesRef
const router = useRouter()

// My Courses functionality
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
  return myCourses.value.map(id => courses.value.find(c => c.id === id)).filter(Boolean)
})

function goToSchedule() {
  router.push('/schedule')
}

const getLevelBadgeClass = (level) => {
  switch(level) {
    case 'Beginner': return 'badge-success'
    case 'Intermediate': return 'badge-warning'
    case 'Advanced': return 'badge-error'
    default: return 'badge-neutral'
  }
}

// Filters (use daisyUI Filter component)
const apOnly = ref(false)
const selectedSubject = ref('All')
const selectedGroup = ref('All')

const filteredCourses = computed(() => {
  return courses.value.filter(c => {
    if (apOnly.value && !c.ap) return false
    if (selectedSubject.value !== 'All' && c.subject !== selectedSubject.value) return false
    if (selectedGroup.value !== 'All' && c.electiveGroup !== selectedGroup.value) return false
    return true
  })
})

const clearFilters = () => {
  apOnly.value = false
  selectedSubject.value = 'All'
  selectedGroup.value = 'All'
}

// Details modal state
const detailsOpen = ref(false)
const selectedCourse = ref(null)
function openDetails(course) {
  selectedCourse.value = course
  detailsOpen.value = true
}
function closeDetails() {
  detailsOpen.value = false
  selectedCourse.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- Hero Section -->
    <div class="text-center mb-8">
      <h2 class="text-4xl font-bold text-base-content mb-4">Our Courses</h2>
      <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
        Discover a wide range of courses designed to inspire learning and foster growth. 
        From foundational subjects to advanced specializations.
      </p>
    </div>

    <!-- Main Content: Courses on left, My Courses on right -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Left: Course List -->
      <div class="lg:col-span-3">
        <div class="space-y-6">

          <!-- Filters (daisyUI Filter components) -->
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body gap-4">
              <div class="flex flex-wrap items-center gap-6">
                <!-- AP filter -->
                <div>
                  <div class="text-xs text-base-content/70 mb-1">AP</div>
                  <form class="filter" @reset="apOnly = false">
                    <input class="btn btn-square" type="reset" value="×"/>
                    <input class="btn" type="radio" name="apFilter" aria-label="AP" @change="apOnly = true"/>
                  </form>
                </div>

                <!-- Subject filter -->
                <div>
                  <div class="text-xs text-base-content/70 mb-1">Subject</div>
                  <form class="filter" @reset="selectedSubject = 'All'">
                    <input class="btn btn-square" type="reset" value="×"/>
                    <input class="btn" type="radio" name="subjectFilter" aria-label="Math" @change="selectedSubject = 'Math'"/>
                    <input class="btn" type="radio" name="subjectFilter" aria-label="Science" @change="selectedSubject = 'Science'"/>
                    <input class="btn" type="radio" name="subjectFilter" aria-label="Language" @change="selectedSubject = 'Language'"/>
                  </form>
                </div>

                <!-- Elective group filter -->
                <div>
                  <div class="text-xs text-base-content/70 mb-1">Elective</div>
                  <form class="filter" @reset="selectedGroup = 'All'">
                    <input class="btn btn-square" type="reset" value="×"/>
                    <input class="btn" type="radio" name="electiveFilter" aria-label="A" @change="selectedGroup = 'A'"/>
                    <input class="btn" type="radio" name="electiveFilter" aria-label="B" @change="selectedGroup = 'B'"/>
                    <input class="btn" type="radio" name="electiveFilter" aria-label="C" @change="selectedGroup = 'C'"/>
                    <input class="btn" type="radio" name="electiveFilter" aria-label="D" @change="selectedGroup = 'D'"/>
                  </form>
                </div>

                <button class="btn btn-ghost btn-sm ml-auto" @click="clearFilters">Clear All</button>
              </div>

              <div class="text-xs text-base-content/60">Showing {{ filteredCourses.length }} of {{ courses.length }} courses</div>
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-1 lg:grid-cols-2">
            <div v-for="course in filteredCourses" :key="course.id" class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
              <div class="card-body p-4">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="card-title text-lg">{{ course.name }}</h3>
                  <div class="badge" :class="getLevelBadgeClass(course.level)">{{ course.level }}</div>
                </div>
                
                <div class="space-y-1.5 mb-3">
                  <div class="flex items-center text-sm text-base-content/70">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                    {{ course.instructor }}
                  </div>
                  <div class="flex items-center text-sm text-base-content/70">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    {{ course.duration }}
                  </div>
                  <div class="flex items-center text-sm text-base-content/70">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                    {{ course.schedule }}
                  </div>
                  <div class="flex items-center gap-2 text-xs">
                    <span class="badge badge-ghost">{{ course.subject }}</span>
                    <span v-if="course.ap" class="badge badge-primary">AP</span>
                    <span class="badge badge-outline">Elective {{ course.electiveGroup }}</span>
                  </div>
                </div>

                <p class="text-sm text-base-content/80 mb-3">{{ course.description }}</p>

                <!-- Course Statistics -->
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <div class="stat bg-base-200 rounded-lg p-2.5">
                    <div class="stat-title text-xs">Students</div>
                    <div class="stat-value text-lg">{{ course.enrolled }}</div>
                    <div class="stat-desc text-xs">of {{ course.capacity }} capacity</div>
                  </div>
                  <div class="stat bg-base-200 rounded-lg p-2.5">
                    <div class="stat-title text-xs">Completion Rate</div>
                    <div class="stat-value text-lg">{{ Math.round(Math.random() * 30 + 70) }}%</div>
                    <div class="stat-desc text-xs">last semester</div>
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <div class="text-xs text-base-content/60">
                    {{ Math.round((course.enrolled / course.capacity) * 100) }}% capacity
                  </div>
                  <div class="flex gap-2">
                    <button 
                      class="btn btn-outline btn-xs"
                      @click="openDetails(course)">
                      View Details
                    </button>
                    <button 
                      class="btn btn-xs" 
                      :class="myCourses.includes(course.id) ? 'btn-error' : 'btn-primary'"
                      @click="toggleCourseInMyCourses(course.id)">
                      {{ myCourses.includes(course.id) ? 'Remove' : 'Add to My Courses' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: My Courses Panel -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 border border-base-300 sticky top-6">
          <div class="card-body">
            <h2 class="card-title text-base-content mb-4">My Courses</h2>
            
            <!-- My Courses List -->
            <div class="mb-4">
              <h3 class="text-sm font-medium text-base-content/70 mb-2">Selected Courses ({{ myCourses.length }})</h3>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div v-for="course in myCoursesObjects" :key="course.id" 
                     class="p-2 rounded border border-base-300 bg-base-50">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-medium truncate">{{ course.name }}</div>
                      <div class="text-[10px] text-base-content/60 truncate">{{ course.instructor }}</div>
                    </div>
                    <button class="btn btn-ghost btn-xs text-error" @click="toggleCourseInMyCourses(course.id)">
                      ✕
                    </button>
                  </div>
                </div>
                <div v-if="myCourses.length === 0" class="text-center text-xs text-base-content/50 py-4">
                  No courses selected
                </div>
              </div>
            </div>
            
            <!-- Schedule button -->
            <div class="mb-4">
              <button class="btn btn-primary w-full" @click="goToSchedule" :disabled="myCourses.length === 0">
                Go to Schedule
                <span v-if="myCourses.length > 0" class="badge badge-secondary ml-2">{{ myCourses.length }}</span>
              </button>
              <div v-if="myCourses.length === 0" class="text-xs text-base-content/60 mt-2 text-center">
                Select courses first to create schedule
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Statistics Summary -->
    <div class="bg-base-200 p-5 rounded-lg mt-10">
      <h3 class="text-xl font-semibold mb-4">Course Statistics</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ filteredCourses.length }}</div>
          <div class="text-sm text-base-content/60">Total Courses</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ filteredCourses.reduce((sum, course) => sum + course.enrolled, 0) }}</div>
          <div class="text-sm text-base-content/60">Total Students</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ filteredCourses.length ? Math.round(filteredCourses.reduce((sum, course) => sum + (course.enrolled / course.capacity), 0) / filteredCourses.length * 100) : 0 }}%</div>
          <div class="text-sm text-base-content/60">Average Capacity</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ filteredCourses.filter(course => course.level === 'Advanced').length }}</div>
          <div class="text-sm text-base-content/60">Advanced Courses</div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <CourseDetailsModal 
      :open="detailsOpen" 
      :course="selectedCourse" 
      @close="closeDetails" />
  </div>
</template>

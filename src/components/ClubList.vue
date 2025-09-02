<script setup>
import { ref, computed, watch } from 'vue'
import ClubDetailsModal from './ClubDetailsModal.vue'

const clubs = ref([
  {
    id: 1,
    name: 'Robotics Club',
    advisor: 'Dr. Alex Chen',
    category: 'STEM',
    members: 32,
    meetingTime: 'Thursdays 3:30-5:00 PM',
    location: 'Engineering Lab 205',
    description: 'Design, build, and program robots for competitions and community projects.',
    achievements: ['Regional Championship 2024', 'Innovation Award'],
    nextEvent: 'Robot Showcase - March 15th',
    isRecruiting: true
  },
  {
    id: 2,
    name: 'Drama Society',
    advisor: 'Ms. Jennifer Park',
    category: 'Arts',
    members: 28,
    meetingTime: 'Tuesdays & Fridays 4:00-6:00 PM',
    location: 'Main Theater',
    description: 'Explore theatrical arts through performances, workshops, and creative collaboration.',
    achievements: ['Best High School Production 2024', 'Community Choice Award'],
    nextEvent: 'Spring Musical Auditions - Feb 20th',
    isRecruiting: true
  },
  {
    id: 3,
    name: 'Environmental Action Group',
    advisor: 'Prof. Maria Santos',
    category: 'Service',
    members: 45,
    meetingTime: 'Wednesdays 3:00-4:30 PM',
    location: 'Science Building Room 101',
    description: 'Promote sustainability and environmental awareness through campus and community initiatives.',
    achievements: ['Campus Solar Panel Project', 'Waste Reduction Initiative'],
    nextEvent: 'Beach Cleanup Drive - March 8th',
    isRecruiting: true
  },
  {
    id: 4,
    name: 'Chess Masters',
    advisor: 'Mr. Robert Kim',
    category: 'Academic',
    members: 18,
    meetingTime: 'Mondays & Wednesdays 3:15-4:45 PM',
    location: 'Library Study Room B',
    description: 'Sharpen strategic thinking skills through chess tournaments and friendly matches.',
    achievements: ['State Tournament Semifinalists', 'Inter-school Champions'],
    nextEvent: 'Monthly Tournament - March 1st',
    isRecruiting: false
  },
  {
    id: 5,
    name: 'Student Photography Club',
    advisor: 'Ms. Rachel Davis',
    category: 'Arts',
    members: 23,
    meetingTime: 'Saturdays 10:00 AM-12:00 PM',
    location: 'Art Studio & Various Locations',
    description: 'Capture moments and tell stories through the lens. Learn techniques and showcase your work.',
    achievements: ['Annual Exhibition Success', 'Local Gallery Featured'],
    nextEvent: 'Nature Photography Workshop - March 12th',
    isRecruiting: true
  },
  {
    id: 6,
    name: 'Debate Team',
    advisor: 'Dr. Samuel Wilson',
    category: 'Academic',
    members: 16,
    meetingTime: 'Tuesdays & Thursdays 4:00-5:30 PM',
    location: 'Conference Room A',
    description: 'Develop critical thinking and public speaking skills through competitive debate.',
    achievements: ['Regional Debate Champions', 'National Qualifier'],
    nextEvent: 'Practice Rounds - Every Tuesday',
    isRecruiting: true
  },
  {
    id: 7,
    name: 'Volunteer Corps',
    advisor: 'Ms. Linda Martinez',
    category: 'Service',
    members: 52,
    meetingTime: 'Flexible - Project Based',
    location: 'Community Center & Various Sites',
    description: 'Make a difference in the community through organized volunteer opportunities.',
    achievements: ['500+ Community Service Hours', 'Youth Service Award'],
    nextEvent: 'Food Bank Volunteer Day - March 5th',
    isRecruiting: true
  },
  {
    id: 8,
    name: 'Coding Club',
    advisor: 'Dr. Lisa Wang',
    category: 'STEM',
    members: 38,
    meetingTime: 'Fridays 3:30-5:30 PM',
    location: 'Computer Lab 302',
    description: 'Learn programming languages, work on projects, and participate in coding competitions.',
    achievements: ['Hackathon Winners 2024', 'App Development Contest'],
    nextEvent: 'Web Development Workshop - March 10th',
    isRecruiting: true
  }
])

const getCategoryBadgeClass = (category) => {
  switch(category) {
    case 'STEM': return 'badge-primary'
    case 'Arts': return 'badge-secondary'
    case 'Academic': return 'badge-accent'
    case 'Service': return 'badge-success'
    default: return 'badge-neutral'
  }
}

const selectedCategory = ref('All')
const categories = ref(['All', 'STEM', 'Arts', 'Academic', 'Service'])

const filteredClubs = computed(() => {
  if (selectedCategory.value === 'All') {
    return clubs.value
  }
  return clubs.value.filter(club => club.category === selectedCategory.value)
})

// My Clubs functionality
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

function toggleClubInMyClubs(clubId) {
  const idx = myClubs.value.indexOf(clubId)
  if (idx === -1) myClubs.value.push(clubId)
  else myClubs.value.splice(idx, 1)
}

const myClubsObjects = computed(() => myClubs.value
  .map(id => clubs.value.find(c => c.id === id))
  .filter(Boolean))

// Details modal
const detailsOpen = ref(false)
const selectedClub = ref(null)
function openDetails(club) {
  selectedClub.value = club
  detailsOpen.value = true
}
function closeDetails() {
  detailsOpen.value = false
  selectedClub.value = null
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center mb-8">
      <h2 class="text-4xl font-bold text-base-content mb-4">Student Clubs</h2>
      <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
        Join a community of like-minded students. Explore your interests, develop new skills, 
        and make lasting friendships through our diverse club offerings.
      </p>
    </div>

    <!-- Category Filter -->
    <div class="flex justify-center mb-8">
      <div class="tabs tabs-boxed">
        <a v-for="category in categories" 
           :key="category"
           class="tab" 
           :class="{'tab-active': selectedCategory === category}"
           @click="selectedCategory = category">
          {{ category }}
        </a>
      </div>
    </div>

    <!-- Main Content: Clubs list left, My Clubs right -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Left: club list -->
      <div class="lg:col-span-3">
        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          <div v-for="club in filteredClubs" :key="club.id" class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
            <div class="card-body p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="card-title text-lg">{{ club.name }}</h3>
            <div class="flex gap-2 items-center">
              <div class="badge" :class="getCategoryBadgeClass(club.category)">{{ club.category }}</div>
              <div v-if="club.isRecruiting" class="badge badge-success badge-sm">Recruiting</div>
            </div>
          </div>
          
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-base-content/70">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
              {{ club.advisor }}
            </div>
            <div class="flex items-center text-sm text-base-content/70">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
              {{ club.meetingTime }}
            </div>
            <div class="flex items-center text-sm text-base-content/70">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              {{ club.location }}
            </div>
            <div class="flex items-center text-sm text-base-content/70">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" clip-rule="evenodd"/>
              </svg>
              {{ club.members }} members
            </div>
          </div>

          <p class="text-sm text-base-content/80 mb-4">{{ club.description }}</p>

          <div v-if="club.achievements && club.achievements.length > 0" class="mb-4">
            <h4 class="font-semibold text-sm text-base-content mb-2">Recent Achievements:</h4>
            <div class="flex flex-wrap gap-1">
              <div v-for="achievement in club.achievements" :key="achievement" class="badge badge-outline badge-sm">
                {{ achievement }}
              </div>
            </div>
          </div>

          <!-- Club Statistics -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-base-200 p-3 rounded-lg">
              <div class="text-xs text-base-content/60">Founded</div>
              <div class="font-semibold">{{ Math.floor(Math.random() * 15 + 2010) }}</div>
            </div>
            <div class="bg-base-200 p-3 rounded-lg">
              <div class="text-xs text-base-content/60">Weekly Hours</div>
              <div class="font-semibold">{{ Math.floor(Math.random() * 8 + 2) }}h</div>
            </div>
          </div>

          <div class="bg-base-200 p-3 rounded-lg mb-4">
            <div class="flex items-center text-sm mb-2">
              <svg class="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
              </svg>
              <span class="font-medium">Next Event:</span>
            </div>
            <p class="text-sm text-base-content/80 ml-6">{{ club.nextEvent }}</p>
          </div>

          <div class="flex justify-between items-center">
            <div class="text-xs text-base-content/60">
              Status: {{ club.isRecruiting ? 'Active Recruitment' : 'Closed' }}
            </div>
            <div class="flex gap-2">
              <button class="btn btn-outline btn-xs" @click="openDetails(club)">View Details</button>
              <button 
                class="btn btn-xs"
                :class="myClubs.includes(club.id) ? 'btn-error' : 'btn-primary'"
                @click="toggleClubInMyClubs(club.id)">
                {{ myClubs.includes(club.id) ? 'Remove' : 'Add to My Clubs' }}
              </button>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: My Clubs panel -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 border border-base-300 sticky top-6">
          <div class="card-body">
            <h2 class="card-title text-base-content mb-4">My Clubs</h2>
            <div class="mb-4">
              <h3 class="text-sm font-medium text-base-content/70 mb-2">Selected Clubs ({{ myClubs.length }})</h3>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div v-for="club in myClubsObjects" :key="club.id" class="p-2 rounded border border-base-300 bg-base-50">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-medium truncate">{{ club.name }}</div>
                      <div class="text-[10px] text-base-content/60 truncate">Advisor: {{ club.advisor }}</div>
                    </div>
                    <button class="btn btn-ghost btn-xs text-error" @click="toggleClubInMyClubs(club.id)">✕</button>
                  </div>
                </div>
                <div v-if="myClubs.length === 0" class="text-center text-xs text-base-content/50 py-4">No clubs selected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Club Statistics Summary -->
    <div class="bg-base-200 p-6 rounded-lg mt-12">
      <h3 class="text-xl font-semibold mb-4">Club Statistics</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ clubs.length }}</div>
          <div class="text-sm text-base-content/60">Total Clubs</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ clubs.reduce((sum, club) => sum + club.members, 0) }}</div>
          <div class="text-sm text-base-content/60">Total Members</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ clubs.filter(club => club.isRecruiting).length }}</div>
          <div class="text-sm text-base-content/60">Actively Recruiting</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ Math.round(clubs.reduce((sum, club) => sum + club.members, 0) / clubs.length) }}</div>
          <div class="text-sm text-base-content/60">Avg Members/Club</div>
        </div>
      </div>
      
      <div class="mt-6 text-center">
        <div class="alert alert-info max-w-md mx-auto">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <div class="text-sm">
            <div class="font-medium">Club Information</div>
            <div>Contact Student Activities for details about any club</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <ClubDetailsModal :open="detailsOpen" :club="selectedClub" @close="closeDetails" />
  </div>
</template>

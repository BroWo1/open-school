<script setup>
import { ref } from 'vue'

const announcements = ref([
  {
    id: 1,
    title: 'Spring Semester Registration Opens',
    date: '2025-01-15',
    category: 'Academic',
    priority: 'high',
    content: 'Spring semester course registration begins January 15th at 8:00 AM. Students can access the registration portal through their student accounts. Early registration is recommended as popular courses fill up quickly.',
    author: 'Registrar Office',
    isSticky: true
  },
  {
    id: 2,
    title: 'Winter Break Schedule Reminder',
    date: '2024-12-18',
    category: 'General',
    priority: 'medium',
    content: 'Campus will be closed from December 23rd through January 2nd for winter break. The library will maintain limited hours during this period. Check the campus calendar for detailed schedules.',
    author: 'Administration',
    isSticky: false
  },
  {
    id: 3,
    title: 'Science Fair Competition Applications Due',
    date: '2025-02-01',
    category: 'Academic',
    priority: 'medium',
    content: 'Applications for the Annual Science Fair are due February 1st. This year\'s theme is "Innovation for Sustainability". Winners will receive scholarships and internship opportunities. Submit your projects through the academic portal.',
    author: 'Science Department',
    isSticky: true
  },
  {
    id: 4,
    title: 'New Cafeteria Menu and Dietary Options',
    date: '2025-01-08',
    category: 'Campus Life',
    priority: 'low',
    content: 'Our cafeteria has expanded its menu to include more vegetarian, vegan, and gluten-free options. New healthy meal plans are also available. Visit the dining services website to view the complete menu and nutritional information.',
    author: 'Dining Services',
    isSticky: false
  },
  {
    id: 5,
    title: 'Career Fair 2025 - Industry Leaders Participating',
    date: '2025-03-15',
    category: 'Career',
    priority: 'high',
    content: 'Mark your calendars! The Annual Career Fair will be held March 15th in the Main Gymnasium. Over 50 companies will be participating, including tech giants, healthcare organizations, and non-profits. Prepare your resumes and dress professionally.',
    author: 'Career Services',
    isSticky: true
  },
  {
    id: 6,
    title: 'Library Extended Hours During Finals',
    date: '2024-12-10',
    category: 'Academic',
    priority: 'medium',
    content: 'The library will extend its operating hours during finals week (December 16-20). We\'ll be open 24/7 to support your study needs. Additional study spaces and computer access will be available in the student center.',
    author: 'Library Services',
    isSticky: false
  },
  {
    id: 7,
    title: 'Mental Health Awareness Week',
    date: '2025-02-10',
    category: 'Wellness',
    priority: 'medium',
    content: 'Join us for Mental Health Awareness Week from February 10-14. Events include stress management workshops, mindfulness sessions, and talks by mental health professionals. All students, faculty, and staff are welcome to participate.',
    author: 'Counseling Center',
    isSticky: false
  },
  {
    id: 8,
    title: 'Campus WiFi Upgrade Scheduled',
    date: '2025-01-20',
    category: 'Technology',
    priority: 'low',
    content: 'IT Services will be upgrading campus WiFi infrastructure on January 20th from 2:00 AM to 6:00 AM. Brief connectivity interruptions may occur during this maintenance window. The upgrade will significantly improve connection speeds and reliability.',
    author: 'IT Services',
    isSticky: false
  }
])

const getCategoryBadgeClass = (category) => {
  switch(category) {
    case 'Academic': return 'border-primary text-primary'
    case 'Career': return 'border-base-content text-base-content'
    case 'Campus Life': return 'border-base-content/60 text-base-content/60'
    case 'Wellness': return 'border-base-content/60 text-base-content/60'
    case 'Technology': return 'border-base-content/60 text-base-content/60'
    case 'General': return 'border-base-content/60 text-base-content/60'
    default: return 'border-base-content/40 text-base-content/40'
  }
}

const getPriorityIcon = (priority) => {
  switch(priority) {
    case 'high': return '🔥'
    case 'medium': return '📢'
    case 'low': return '💬'
    default: return '📝'
  }
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const selectedCategory = ref('All')
const selectedPriority = ref('All')
const searchQuery = ref('')
const viewMode = ref('cards')
const categories = ref(['All', 'Academic', 'Career', 'Campus Life', 'Wellness', 'Technology', 'General'])

const filteredAnnouncements = computed(() => {
  let filtered = announcements.value
  
  // Filter by category
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(announcement => announcement.category === selectedCategory.value)
  }
  
  // Filter by priority
  if (selectedPriority.value !== 'All') {
    filtered = filtered.filter(announcement => announcement.priority === selectedPriority.value)
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(announcement => 
      announcement.title.toLowerCase().includes(query) ||
      announcement.content.toLowerCase().includes(query) ||
      announcement.author.toLowerCase().includes(query)
    )
  }
  
  // Sort by sticky first, then by date (newest first)
  return filtered.sort((a, b) => {
    if (a.isSticky && !b.isSticky) return -1
    if (!a.isSticky && b.isSticky) return 1
    return new Date(b.date) - new Date(a.date)
  })
})

import { computed } from 'vue'
</script>

<template>
  <div class="space-y-6">
    <!-- Database Header -->
    <div class="bg-base-100 border border-base-300 rounded-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-2xl font-bold text-base-content">Announcements Database</h2>
          <p class="text-sm text-base-content/60">Open THIS School - Public Records</p>
        </div>
        <div class="text-sm text-base-content/50">
          Total Records: {{ announcements.length }}
        </div>
      </div>
      
      <!-- Database Controls -->
      <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <!-- Category Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Filter:</label>
          <select v-model="selectedCategory" class="select select-bordered select-sm">
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <!-- Priority Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Priority:</label>
          <select v-model="selectedPriority" class="select select-bordered select-sm">
            <option value="All">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <!-- Search -->
        <div class="flex items-center gap-2 flex-1">
          <label class="text-sm font-medium">Search:</label>
          <input v-model="searchQuery" type="text" placeholder="Search announcements..." 
                 class="input input-bordered input-sm flex-1 max-w-xs" />
        </div>
        
        <!-- View Toggle -->
        <div class="flex items-center gap-2">
          <button @click="viewMode = 'cards'" 
                  class="btn btn-sm" :class="viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'">
            Cards
          </button>
          <button @click="viewMode = 'table'" 
                  class="btn btn-sm" :class="viewMode === 'table' ? 'btn-primary' : 'btn-ghost'">
            Table
          </button>
        </div>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="bg-base-200 p-6 rounded-lg">
      <div class="flex justify-between items-center text-sm">
        <span class="text-base-content/70">
          Showing {{ filteredAnnouncements.length }} of {{ announcements.length }} records
        </span>
        <span class="text-base-content/50">
          Last updated: {{ new Date().toLocaleDateString() }}
        </span>
      </div>
    </div>

    <!-- Card View -->
    <div v-if="viewMode === 'cards'" class="space-y-4">
      <div v-for="announcement in filteredAnnouncements" 
           :key="announcement.id" 
           class="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow"
           :class="{
             'border-l-4 border-l-black': announcement.priority === 'high',
             'border-l-4 border-l-base-content/40': announcement.priority === 'medium',
             'bg-base-50 shadow-md': announcement.isSticky
           }">
        <div class="card-body p-6">
          <!-- Header -->
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-3 flex-1">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-base-200 rounded-full flex items-center justify-center text-sm">
                  {{ getPriorityIcon(announcement.priority) }}
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-lg text-base-content">{{ announcement.title }}</h3>
                  <div v-if="announcement.isSticky" class="badge badge-outline badge-xs">Pinned</div>
                </div>
              </div>
            </div>
            <div class="badge badge-outline badge-sm" :class="getCategoryBadgeClass(announcement.category)">
              {{ announcement.category }}
            </div>
          </div>
          
          <!-- Meta info -->
          <div class="flex items-center text-xs text-base-content/60 mb-4 gap-3 ml-11">
            <div class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
              </svg>
              <span>{{ formatDate(announcement.date) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
              <span>{{ announcement.author }}</span>
            </div>
            <div class="text-xs text-base-content/40">
              ID: {{ announcement.id }}
            </div>
          </div>

          <!-- Content -->
          <div class="ml-11">
            <p class="text-base-content/80 leading-relaxed text-sm mb-4">{{ announcement.content }}</p>
            
            <!-- Actions -->
            <div class="flex justify-between items-center">
              <div class="text-xs text-base-content/50">
                Priority: {{ announcement.priority }} | Status: {{ announcement.isSticky ? 'Pinned' : 'Active' }}
              </div>
              <button class="btn btn-ghost btn-xs hover:bg-base-200">
                View Record →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div v-else class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th class="w-12">ID</th>
            <th class="w-16">Priority</th>
            <th>Title</th>
            <th class="w-24">Category</th>
            <th class="w-32">Author</th>
            <th class="w-24">Date</th>
            <th class="w-16">Status</th>
            <th class="w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="announcement in filteredAnnouncements" 
              :key="announcement.id"
              :class="{ 'bg-base-200': announcement.isSticky }">
            <td class="font-mono text-xs">{{ announcement.id }}</td>
            <td>
              <div class="flex items-center gap-2">
                <span class="text-xs">{{ getPriorityIcon(announcement.priority) }}</span>
                <span class="text-xs capitalize">{{ announcement.priority }}</span>
              </div>
            </td>
            <td>
              <div class="font-medium">{{ announcement.title }}</div>
              <div class="text-xs text-base-content/60 truncate max-w-xs">{{ announcement.content }}</div>
            </td>
            <td>
              <div class="badge badge-outline badge-xs" :class="getCategoryBadgeClass(announcement.category)">
                {{ announcement.category }}
              </div>
            </td>
            <td class="text-xs">{{ announcement.author }}</td>
            <td class="text-xs">{{ formatDate(announcement.date) }}</td>
            <td>
              <div v-if="announcement.isSticky" class="badge badge-warning badge-xs">Pinned</div>
              <div v-else class="badge badge-success badge-xs">Active</div>
            </td>
            <td>
              <button class="btn btn-ghost btn-xs">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Emergency Alerts Section -->
    <div class="mt-12">
      <div class="alert alert-warning">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <div>
          <h3 class="font-bold">Emergency Alert System</h3>
          <div class="text-sm">For urgent campus updates, follow @OpenTHISAlerts on social media or sign up for SMS notifications through your student portal.</div>
        </div>
      </div>
    </div>

    <!-- Newsletter Signup -->
    <div class="card bg-base-200 border border-base-300 mt-8">
      <div class="card-body p-6 text-center">
        <h3 class="text-xl font-semibold mb-2 text-base-content">Newsletter</h3>
        <p class="mb-4 text-base-content/70">Get weekly updates about school news and events.</p>
        <div class="flex gap-2 justify-center max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" class="input input-bordered flex-1" />
          <button class="btn btn-primary">Subscribe</button>
        </div>
      </div>
    </div>
  </div>
</template>

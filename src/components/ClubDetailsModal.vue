<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  club: { type: Object, default: null }
})

const emit = defineEmits(['close'])

// Roster persistence per club
const roster = ref([])
const newMember = ref('')
const rosterSearch = ref('')

const storageKey = computed(() => props.club ? `club-roster-${props.club.id}` : '')

function loadRoster() {
  if (!storageKey.value) return
  try {
    const saved = localStorage.getItem(storageKey.value)
    if (saved) {
      roster.value = JSON.parse(saved)
    } else {
      // Seed a minimal placeholder roster capped at 20 entries for large clubs
      const count = Math.min(props.club?.members || 0, 12)
      roster.value = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        name: `Member ${i + 1}`,
        role: i === 0 ? 'President' : i === 1 ? 'Vice President' : i === 2 ? 'Secretary' : 'Member'
      }))
      saveRoster()
    }
  } catch {
    roster.value = []
  }
}

function saveRoster() {
  if (!storageKey.value) return
  try {
    localStorage.setItem(storageKey.value, JSON.stringify(roster.value))
  } catch {
    // ignore
  }
}

watch(() => props.club, () => loadRoster())

function addMember() {
  const name = newMember.value.trim()
  if (!name) return
  roster.value.unshift({ id: Date.now(), name, role: 'Member' })
  newMember.value = ''
  saveRoster()
}

function removeMember(id) {
  roster.value = roster.value.filter(m => m.id !== id)
  saveRoster()
}

const filteredRoster = computed(() => {
  const q = rosterSearch.value.trim().toLowerCase()
  if (!q) return roster.value
  return roster.value.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q))
})

// Derived stats
const recruitingStatus = computed(() => props.club?.isRecruiting ? 'Actively Recruiting' : 'Closed')

function closeModal() {
  emit('close')
}
</script>

<template>
  <Transition name="fade-zoom">
  <div v-if="open && club" class="modal modal-open">
    <div class="modal-box max-w-6xl p-0 overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-base-300 flex items-start justify-between bg-base-100">
        <div>
          <div class="flex items-center gap-3">
            <h3 class="text-xl font-semibold">{{ club.name }}</h3>
            <div class="badge" :class="{
              'badge-primary': club.category === 'STEM',
              'badge-secondary': club.category === 'Arts',
              'badge-accent': club.category === 'Academic',
              'badge-success': club.category === 'Service'
            }">{{ club.category }}</div>
          </div>
          <div class="text-sm text-base-content/70 flex items-center gap-3 mt-1">
            <span>Advisor: {{ club.advisor }}</span>
            <span class="hidden md:inline">•</span>
            <span class="hidden md:inline">{{ club.meetingTime }}</span>
            <span class="hidden md:inline">•</span>
            <span class="hidden md:inline">{{ club.location }}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" @click="closeModal">✕</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <!-- Left: club info -->
        <div class="lg:col-span-2 p-6 space-y-6 bg-base-100">
          <div class="prose max-w-none">
            <p class="text-base-content/80">{{ club.description }}</p>
          </div>

          <!-- Quick stats -->
          <div class="grid grid-cols-3 gap-3">
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">Members</div>
              <div class="stat-value text-lg">{{ club.members }}</div>
              <div class="stat-desc text-xs">{{ recruitingStatus }}</div>
            </div>
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">Meetings</div>
              <div class="stat-value text-lg">{{ club.meetingTime.split(' ')[0] }}</div>
              <div class="stat-desc text-xs">{{ club.meetingTime }}</div>
            </div>
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">Location</div>
              <div class="stat-value text-lg truncate">{{ club.location }}</div>
              <div class="stat-desc text-xs">On campus</div>
            </div>
          </div>

          <!-- Highlights -->
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body p-5">
              <h4 class="card-title text-base">Highlights</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <div class="text-xs text-base-content/60 mb-1">Achievements</div>
                  <div class="flex flex-wrap gap-1">
                    <div v-for="ach in club.achievements" :key="ach" class="badge badge-outline badge-sm">{{ ach }}</div>
                  </div>
                </div>
                <div>
                  <div class="text-xs text-base-content/60 mb-1">Next Event</div>
                  <div class="text-sm text-base-content/80">{{ club.nextEvent }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: roster -->
        <div class="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-base-300 bg-base-50 p-6">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold">Club Roster</h4>
            <span class="badge badge-ghost">{{ roster.length }}</span>
          </div>

          <div class="form-control mb-3">
            <input v-model="rosterSearch" type="text" placeholder="Search roster..." class="input input-bordered input-sm w-full" />
          </div>

          <div class="flex gap-2 mb-3">
            <input v-model="newMember" type="text" placeholder="Add member name" class="input input-bordered input-sm flex-1" />
            <button class="btn btn-primary btn-sm" :disabled="!newMember.trim()" @click="addMember">Add</button>
          </div>

          <div class="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
            <div v-if="filteredRoster.length === 0" class="text-sm text-base-content/60">No members found.</div>
            <div v-for="m in filteredRoster" :key="m.id" class="p-2 rounded border border-base-300 bg-base-100">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-medium">{{ m.name }}</div>
                  <div class="text-xs text-base-content/60">{{ m.role }}</div>
                </div>
                <button class="btn btn-ghost btn-xs" @click="removeMember(m.id)">Remove</button>
              </div>
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

.fade-zoom-enter-active,
.fade-zoom-leave-active { transition: opacity 200ms ease; }
.fade-zoom-enter-from,
.fade-zoom-leave-to { opacity: 0; }
.fade-zoom-enter-active .modal-box,
.fade-zoom-leave-active .modal-box { transition: transform 200ms ease, opacity 200ms ease; }
.fade-zoom-enter-from .modal-box,
.fade-zoom-leave-to .modal-box { transform: translateY(12px) scale(0.98); opacity: 0; }
</style>


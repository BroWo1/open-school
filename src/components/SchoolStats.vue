<script setup>
import { ref, onMounted } from 'vue'

const stats = ref(null)
const loading = ref(true)
const error = ref(null)

const fallback = {
  school: { name: 'OpenTHIS International High School', location: 'Shanghai, China', timezone: 'Asia/Shanghai' },
  overview: {
    students: 1200,
    faculty: 120,
    student_teacher_ratio: '8:1',
    boarding_percentage: 40,
    languages_offered: ['English', 'Mandarin Chinese', 'Spanish'],
    clubs: 65,
    programs: ['IB Diploma', 'AP Courses'],
    graduation_rate: 98,
  },
  academics: {
    ib: { average_score: 35, pass_rate: 92, max_score: 45 },
    ap: { exams_taken: 1600, pass_rate: 88 },
    university_acceptance: { overall_rate: 95, top_100_rate: 78, top_destinations: ['US', 'UK', 'Canada', 'Hong Kong', 'Australia'] },
  },
  diversity: {
    nationalities_count: 60,
    top_nationalities: [
      { country: 'China (Mainland)', percent: 52 },
      { country: 'South Korea', percent: 10 },
      { country: 'United States', percent: 8 },
      { country: 'Japan', percent: 6 },
      { country: 'Canada', percent: 4 },
    ],
  },
  last_updated: '2025-08-15',
}

onMounted(async () => {
  try {
    const res = await fetch('/data/school-stats.json')
    if (!res.ok) throw new Error('Failed to load stats')
    stats.value = await res.json()
  } catch (e) {
    stats.value = fallback
    error.value = e?.message || 'Unable to load live data'
  } finally {
    loading.value = false
  }
})

const pct = (num, den) => Math.round((num / den) * 100)
</script>

<template>
  <section class="bg-base-100">
    <div class="container mx-auto px-6 py-16">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-bold text-base-content">School Statistics</h2>
        <p class="mt-2 text-base-content/70">International high school in China — at a glance</p>
      </div>

      <div v-if="loading" class="flex justify-center py-10">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <div v-else>
        <!-- Top stats -->
        <div class="stats stats-vertical lg:stats-horizontal w-full bg-base-100 border border-base-300 rounded-xl shadow-sm mb-10">
          <div class="stat">
            <div class="stat-title">Students</div>
            <div class="stat-value">{{ stats.overview.students.toLocaleString() }}+</div>
            <div class="stat-desc">Enrolled across grades 9–12</div>
          </div>
          <div class="stat">
            <div class="stat-title">Faculty</div>
            <div class="stat-value">{{ stats.overview.faculty }}+</div>
            <div class="stat-desc">Experienced international educators</div>
          </div>
          <div class="stat">
            <div class="stat-title">Nationalities</div>
            <div class="stat-value">{{ stats.diversity.nationalities_count }}+</div>
            <div class="stat-desc">Truly global community</div>
          </div>
          <div class="stat">
            <div class="stat-title">Stu–Teacher</div>
            <div class="stat-value">{{ stats.overview.student_teacher_ratio }}</div>
            <div class="stat-desc">Personalized learning</div>
          </div>
        </div>

        <!-- Academic outcomes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <h3 class="card-title text-base-content">IB Outcomes</h3>
              <div class="grid grid-cols-2 gap-6 items-center">
                <div class="text-center">
                  <div class="radial-progress text-primary" :style="{ '--value': pct(stats.academics.ib.average_score, stats.academics.ib.max_score) }" role="progressbar">
                    {{ stats.academics.ib.average_score }}/{{ stats.academics.ib.max_score }}
                  </div>
                  <div class="mt-2 text-sm text-base-content/70">Average IB Score</div>
                </div>
                <div class="text-center">
                  <div class="radial-progress text-secondary" :style="{ '--value': stats.academics.ib.pass_rate }" role="progressbar">
                    {{ stats.academics.ib.pass_rate }}%
                  </div>
                  <div class="mt-2 text-sm text-base-content/70">IB Diploma Pass</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <h3 class="card-title text-base-content">University Admissions</h3>
              <div class="grid grid-cols-2 gap-6 items-center">
                <div class="text-center">
                  <div class="radial-progress text-accent" :style="{ '--value': stats.academics.university_acceptance.top_100_rate }" role="progressbar">
                    {{ stats.academics.university_acceptance.top_100_rate }}%
                  </div>
                  <div class="mt-2 text-sm text-base-content/70">Top 100 Offers</div>
                </div>
                <div class="text-center">
                  <div class="radial-progress text-neutral" :style="{ '--value': stats.academics.university_acceptance.overall_rate }" role="progressbar">
                    {{ stats.academics.university_acceptance.overall_rate }}%
                  </div>
                  <div class="mt-2 text-sm text-base-content/70">Overall Acceptance</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Diversity: nationalities -->
        <div class="card bg-base-100 border border-base-300 mb-10">
          <div class="card-body">
            <h3 class="card-title text-base-content">Nationality Distribution</h3>
            <div class="space-y-4 mt-2">
              <div v-for="n in stats.diversity.top_nationalities" :key="n.country">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-base-content/80">{{ n.country }}</span>
                  <span class="font-medium">{{ n.percent }}%</span>
                </div>
                <progress class="progress w-full" :value="n.percent" max="100"></progress>
              </div>
            </div>
          </div>
        </div>

        <!-- Highlights -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <h3 class="card-title">Languages</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="lang in stats.overview.languages_offered" :key="lang" class="badge badge-ghost">{{ lang }}</span>
              </div>
            </div>
          </div>
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <h3 class="card-title">Boarding</h3>
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-base-content/70">Boarding Students</span>
                <span class="font-medium">{{ stats.overview.boarding_percentage }}%</span>
              </div>
              <progress class="progress w-full" :value="stats.overview.boarding_percentage" max="100"></progress>
            </div>
          </div>
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <h3 class="card-title">Clubs & Activities</h3>
              <p class="text-4xl font-bold">{{ stats.overview.clubs }}+</p>
              <p class="text-base-content/70">Student-led clubs, teams, and societies</p>
            </div>
          </div>
        </div>

        <div class="mt-8 text-xs text-base-content/60 text-center">
          <p>Data last updated: {{ stats.last_updated }} <span v-if="error">(showing fallback)</span></p>
        </div>
      </div>
    </div>
  </section>
</template>


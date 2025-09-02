import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import CoursesPage from '../pages/CoursesPage.vue'
import ClubsPage from '../pages/ClubsPage.vue'
import AnnouncementsPage from '../pages/AnnouncementsPage.vue'
import SchedulePage from '../pages/SchedulePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/courses',
    name: 'Courses',
    component: CoursesPage
  },
  {
    path: '/clubs',
    name: 'Clubs',
    component: ClubsPage
  },
  {
    path: '/announcements',
    name: 'Announcements',
    component: AnnouncementsPage
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: SchedulePage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router

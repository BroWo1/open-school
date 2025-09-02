<template>
  <header class="navbar bg-base-100/70 backdrop-blur-md border-b border-base-300 px-6 py-3 sticky top-0 z-50">
    <div class="navbar-start">
      <div class="dropdown lg:hidden">
        <div tabindex="0" role="button" class="btn btn-ghost">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
          <li><RouterLink to="/courses" class="hover:bg-base-200">Courses</RouterLink></li>
          <li><RouterLink to="/clubs" class="hover:bg-base-200">Clubs</RouterLink></li>
          <li><RouterLink to="/announcements" class="hover:bg-base-200">Announcements</RouterLink></li>
          <li><RouterLink to="/schedule" class="hover:bg-base-200">Schedule</RouterLink></li>
        </ul>
      </div>
      <RouterLink
        to="/"
        class="inline-flex items-center px-2 py-1 rounded-md transition-colors duration-150 hover:bg-base-200 focus-visible:bg-base-200"
        aria-label="OpenTHIS Home"
      >
        <img :src="logoUrl" alt="OpenTHIS logo" class="h-8 w-auto" />
      </RouterLink>
    </div>
    
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 gap-1">
        <li><RouterLink to="/courses" class="hover:bg-base-200" :class="{ 'bg-base-200': $route.path === '/courses' }">Courses</RouterLink></li>
        <li><RouterLink to="/clubs" class="hover:bg-base-200" :class="{ 'bg-base-200': $route.path === '/clubs' }">Clubs</RouterLink></li>
        <li><RouterLink to="/announcements" class="hover:bg-base-200" :class="{ 'bg-base-200': $route.path === '/announcements' }">Announcements</RouterLink></li>
        <li><RouterLink to="/schedule" class="hover:bg-base-200" :class="{ 'bg-base-200': $route.path === '/schedule' }">Schedule</RouterLink></li>
      </ul>
    </div>
    
    <div class="navbar-end">
      <div class="flex items-center gap-2">
        <button class="btn btn-outline btn-sm">Login</button>
      </div>
    </div>
  </header>
  
</template>

<script setup>
import logoUrl from '@/assets/openthis.png'
</script>

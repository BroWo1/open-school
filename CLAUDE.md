# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Architecture

This is a Vue 3 single-page application built with Vite, using Vue Router for navigation and Tailwind CSS with DaisyUI for styling.

### Key Structure
- **Entry Point**: `src/main.js` - Creates Vue app with router
- **Root Component**: `src/App.vue` - Contains AppHeader, RouterView, and AppFooter
- **Router**: `src/router/index.js` - Defines routes for all pages with scroll behavior
- **Pages**: `src/pages/` - Main page components (HomePage, CoursesPage, ClubsPage, AnnouncementsPage, ContactPage)
- **Components**: `src/components/` - Reusable components including layout components (AppHeader, AppFooter)
- **Assets**: `src/assets/` - CSS files and static assets

### Technology Stack
- Vue 3 with Composition API (script setup syntax)
- Vue Router 4 for SPA routing
- Vite for build tooling and development server
- Tailwind CSS v4 with DaisyUI components
- Path alias `@/` configured for `src/` directory

### Styling
- Uses DaisyUI theme system with `data-theme="light"` on root element
- Global styles in `src/assets/main.css`
- Smooth scrolling and section spacing configured
- Container max-width set to 1200px

### Development Notes
- Node.js version requirement: ^20.19.0 || >=22.12.0
- Uses ES modules (type: "module" in package.json)
- Vue DevTools plugin enabled in development
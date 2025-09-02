import { ref } from 'vue'

// Unified course data source
const courses = ref([
  {
    id: 1,
    name: 'Advanced Mathematics',
    instructor: 'Dr. Sarah Chen',
    duration: '16 weeks',
    level: 'Advanced',
    description: 'Deep dive into calculus, linear algebra, and differential equations.',
    enrolled: 24,
    capacity: 30,
    schedule: 'Mon, Wed, Fri 9:00-10:30 AM',
    subject: 'Math',
    electiveGroup: 'A',
    ap: false,
    // Schedule pattern for 6-day cycle
    pattern: [
      { day: 1, period: 1 }, { day: 3, period: 2 }, { day: 5, period: 3 }
    ],
    room: 'N304'
  },
  {
    id: 2,
    name: 'Creative Writing Workshop',
    instructor: 'Prof. Michael Torres',
    duration: '12 weeks',
    level: 'Intermediate',
    description: 'Explore narrative techniques, poetry, and creative expression.',
    enrolled: 18,
    capacity: 20,
    schedule: 'Tue, Thu 2:00-3:30 PM',
    subject: 'Language',
    electiveGroup: 'B',
    ap: false,
    pattern: [
      { day: 2, period: 2 }, { day: 4, period: 3 }, { day: 6, period: 4 }
    ],
    room: 'N308'
  },
  {
    id: 3,
    name: 'Computer Science Fundamentals',
    instructor: 'Dr. Lisa Wang',
    duration: '18 weeks',
    level: 'Beginner',
    description: 'Introduction to programming, algorithms, and data structures.',
    enrolled: 28,
    capacity: 35,
    schedule: 'Mon, Wed, Fri 11:00 AM-12:30 PM',
    subject: 'Science',
    electiveGroup: 'C',
    ap: false,
    pattern: [
      { day: 1, period: 2 }, { day: 3, period: 3 }, { day: 5, period: 4 }
    ],
    room: 'N413'
  },
  {
    id: 4,
    name: 'Environmental Science',
    instructor: 'Prof. James Rodriguez',
    duration: '14 weeks',
    level: 'Intermediate',
    description: 'Study of ecosystems, climate change, and sustainability.',
    enrolled: 22,
    capacity: 25,
    schedule: 'Tue, Thu 10:00-11:30 AM',
    subject: 'Science',
    electiveGroup: 'D',
    ap: false,
    pattern: [
      { day: 2, period: 1 }, { day: 4, period: 2 }, { day: 6, period: 3 }
    ],
    room: 'N307'
  },
  {
    id: 5,
    name: 'Art History & Appreciation',
    instructor: 'Dr. Emma Thompson',
    duration: '10 weeks',
    level: 'Beginner',
    description: 'Journey through art movements from Renaissance to modern day.',
    enrolled: 16,
    capacity: 25,
    schedule: 'Wed 6:00-8:00 PM',
    subject: 'Language',
    electiveGroup: 'A',
    ap: false,
    pattern: [
      { day: 1, period: 3 }, { day: 3, period: 4 }, { day: 5, period: 1 }
    ],
    room: 'N313'
  },
  {
    id: 6,
    name: 'Business Ethics & Leadership',
    instructor: 'Prof. David Kim',
    duration: '12 weeks',
    level: 'Advanced',
    description: 'Explore ethical decision-making and leadership principles in business.',
    enrolled: 20,
    capacity: 22,
    schedule: 'Thu 7:00-9:00 PM',
    subject: 'Language',
    electiveGroup: 'B',
    ap: false,
    pattern: [
      { day: 2, period: 3 }, { day: 4, period: 4 }, { day: 6, period: 1 }
    ],
    room: 'N308'
  },
  {
    id: 7,
    name: 'AP Calculus AB',
    instructor: 'Dr. Wei Zhang',
    duration: '16 weeks',
    level: 'Advanced',
    description: 'Differential and integral calculus aligned with AP curriculum.',
    enrolled: 26,
    capacity: 28,
    schedule: 'Mon, Wed 2:00-3:30 PM',
    subject: 'Math',
    electiveGroup: 'C',
    ap: true,
    pattern: [
      { day: 1, period: 4 }, { day: 3, period: 1 }, { day: 5, period: 2 }
    ],
    room: 'N405'
  },
  {
    id: 8,
    name: 'AP Environmental Science',
    instructor: 'Prof. Li Na',
    duration: '16 weeks',
    level: 'Advanced',
    description: 'Interdisciplinary course exploring ecological principles and human impacts.',
    enrolled: 19,
    capacity: 24,
    schedule: 'Tue, Thu 9:00-10:30 AM',
    subject: 'Science',
    electiveGroup: 'D',
    ap: true,
    pattern: [
      { day: 2, period: 4 }, { day: 4, period: 1 }, { day: 6, period: 2 }
    ],
    room: 'N500'
  }
])

export function useCourses() {
  return {
    courses: courses.value,
    coursesRef: courses
  }
}
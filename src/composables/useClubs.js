import { ref } from 'vue'

// Unified clubs data source
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

export function useClubs() {
  return {
    clubs: clubs.value,
    clubsRef: clubs
  }
}


export const STREAMS = {
  'AI & ML': {
    id: 'AI & ML',
    icon: '🤖',
    desc: 'Deep Learning & Neural Networks',
    capabilities: {
      'Programming': ['Python', 'SQL', 'NumPy', 'Pandas'],
      'Machine Learning': ['ML Fundamentals', 'Scikit-learn', 'Supervised Learning', 'Unsupervised Learning', 'Feature Engineering', 'Model Evaluation'],
      'Deep Learning': ['Neural Networks', 'PyTorch', 'TensorFlow', 'Deep Learning Fundamentals'],
      'AI': ['Generative AI', 'NLP', 'Computer Vision', 'LLM Fundamentals']
    },
    tools: ['Python', 'SQL', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'Jupyter', 'Google Colab', 'Git'],
    domains: [
      'Machine Learning', 'Deep Learning', 'Generative AI', 'Natural Language Processing',
      'Computer Vision', 'Large Language Models', 'AI Engineering', 'Reinforcement Learning', 'MLOps'
    ],
    specializations: [
      'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'NLP',
      'Computer Vision', 'Generative AI', 'LLMs', 'MLOps'
    ],
    careerGoals: [
      'AI/ML Engineer', 'Machine Learning Engineer', 'Deep Learning Engineer',
      'NLP Engineer', 'Computer Vision Engineer', 'AI Research Scientist', 'MLOps Engineer'
    ],
    recommendedCourses: [
      { id: 'c1', title: 'Python for Machine Learning', domain: 'Programming', difficulty: 'Beginner', duration: '3 weeks', technologies: ['Python', 'NumPy', 'Pandas'], skills: ['Python'], domainRelevance: 0.9 },
      { id: 'c2', title: 'Machine Learning Fundamentals', domain: 'Machine Learning', difficulty: 'Beginner', duration: '4 weeks', technologies: ['Scikit-learn', 'Python'], skills: ['Python', 'NumPy'], domainRelevance: 1.0 },
      { id: 'c3', title: 'Supervised Learning Masterclass', domain: 'Machine Learning', difficulty: 'Intermediate', duration: '3 weeks', technologies: ['Scikit-learn', 'Pandas'], skills: ['ML Fundamentals', 'Python'], domainRelevance: 0.95 },
      { id: 'c4', title: 'Feature Engineering for ML', domain: 'Machine Learning', difficulty: 'Intermediate', duration: '2 weeks', technologies: ['Pandas', 'Scikit-learn'], skills: ['Python', 'ML Fundamentals'], domainRelevance: 0.9 },
      { id: 'c5', title: 'Deep Learning with TensorFlow', domain: 'Deep Learning', difficulty: 'Intermediate', duration: '5 weeks', technologies: ['TensorFlow', 'Keras', 'Python'], skills: ['ML Fundamentals', 'Python'], domainRelevance: 1.0 },
      { id: 'c6', title: 'Neural Networks from Scratch', domain: 'Deep Learning', difficulty: 'Intermediate', duration: '3 weeks', technologies: ['Python', 'NumPy'], skills: ['Python', 'ML Fundamentals'], domainRelevance: 0.95 },
      { id: 'c7', title: 'PyTorch Deep Learning Bootcamp', domain: 'Deep Learning', difficulty: 'Intermediate', duration: '4 weeks', technologies: ['PyTorch', 'Python'], skills: ['Deep Learning Fundamentals', 'Python'], domainRelevance: 0.95 },
      { id: 'c8', title: 'Natural Language Processing', domain: 'AI', difficulty: 'Advanced', duration: '4 weeks', technologies: ['Python', 'NLTK', 'Transformers'], skills: ['Deep Learning Fundamentals', 'Python'], domainRelevance: 1.0 },
      { id: 'c9', title: 'Computer Vision with Deep Learning', domain: 'AI', difficulty: 'Advanced', duration: '4 weeks', technologies: ['PyTorch', 'OpenCV', 'Python'], skills: ['Deep Learning Fundamentals', 'Python'], domainRelevance: 1.0 },
      { id: 'c10', title: 'Generative AI & LLMs', domain: 'AI', difficulty: 'Advanced', duration: '5 weeks', technologies: ['Python', 'Transformers', 'LangChain'], skills: ['Deep Learning Fundamentals', 'NLP'], domainRelevance: 1.0 },
      { id: 'c11', title: 'MLOps & Model Deployment', domain: 'Machine Learning', difficulty: 'Intermediate', duration: '3 weeks', technologies: ['Docker', 'MLflow', 'Python'], skills: ['ML Fundamentals', 'Python'], domainRelevance: 0.85 },
      { id: 'c12', title: 'Unsupervised Learning & Clustering', domain: 'Machine Learning', difficulty: 'Intermediate', duration: '2 weeks', technologies: ['Scikit-learn', 'Python'], skills: ['ML Fundamentals', 'Python'], domainRelevance: 0.85 }
    ]
  },

  'AI & Data Science': {
    id: 'AI & Data Science',
    icon: '📊',
    desc: 'Data Analytics & Statistics',
    capabilities: {
      'Programming': ['Python', 'SQL', 'R'],
      'Data Analysis': ['Pandas', 'NumPy', 'Excel', 'Data Cleaning', 'Exploratory Data Analysis'],
      'Business Intelligence': ['Power BI', 'Tableau'],
      'Statistics': ['Descriptive Statistics', 'Probability', 'Hypothesis Testing', 'Statistical Modeling'],
      'Data Science': ['Machine Learning', 'Feature Engineering', 'Data Visualization', 'Predictive Analytics']
    },
    tools: ['Python', 'SQL', 'R', 'Excel', 'Power BI', 'Tableau', 'Pandas', 'NumPy', 'Jupyter', 'Google Sheets'],
    domains: [
      'Data Analytics', 'Data Science', 'Business Intelligence', 'Data Engineering',
      'Predictive Analytics', 'Machine Learning', 'Business Analytics',
      'Statistical Analysis', 'Data Visualization', 'AI Analytics'
    ],
    specializations: [
      'Data Analytics', 'Data Science', 'Statistics', 'Data Engineering',
      'Power BI', 'Tableau', 'Machine Learning', 'Business Intelligence', 'Data Visualization'
    ],
    careerGoals: [
      'Data Analyst', 'Data Scientist', 'Business Intelligence Analyst',
      'Data Engineer', 'Analytics Engineer', 'Statistical Analyst', 'BI Developer'
    ],
    recommendedCourses: [
      { id: 'ds1', title: 'Python for Data Analysis', domain: 'Programming', difficulty: 'Beginner', duration: '3 weeks', technologies: ['Python', 'Pandas'], skills: ['Python'], domainRelevance: 0.9 },
      { id: 'ds2', title: 'SQL for Data Analysis', domain: 'Programming', difficulty: 'Beginner', duration: '2 weeks', technologies: ['SQL'], skills: ['SQL'], domainRelevance: 0.95 },
      { id: 'ds3', title: 'Statistics for Data Science', domain: 'Statistics', difficulty: 'Beginner', duration: '4 weeks', technologies: ['Python', 'SciPy'], skills: ['Python'], domainRelevance: 1.0 },
      { id: 'ds4', title: 'Data Cleaning & Wrangling', domain: 'Data Analysis', difficulty: 'Beginner', duration: '2 weeks', technologies: ['Python', 'Pandas'], skills: ['Python', 'Pandas'], domainRelevance: 0.95 },
      { id: 'ds5', title: 'Exploratory Data Analysis', domain: 'Data Analysis', difficulty: 'Intermediate', duration: '3 weeks', technologies: ['Python', 'Matplotlib', 'Seaborn'], skills: ['Python', 'Pandas', 'NumPy'], domainRelevance: 0.95 },
      { id: 'ds6', title: 'Data Visualization Mastery', domain: 'Data Visualization', difficulty: 'Intermediate', duration: '3 weeks', technologies: ['Tableau', 'Matplotlib', 'Seaborn'], skills: ['Python'], domainRelevance: 0.9 },
      { id: 'ds7', title: 'Power BI Complete Course', domain: 'Business Intelligence', difficulty: 'Intermediate', duration: '3 weeks', technologies: ['Power BI', 'DAX'], skills: ['Excel'], domainRelevance: 1.0 },
      { id: 'ds8', title: 'Predictive Analytics with Python', domain: 'Data Science', difficulty: 'Intermediate', duration: '4 weeks', technologies: ['Python', 'Scikit-learn'], skills: ['Python', 'Statistics'], domainRelevance: 0.95 },
      { id: 'ds9', title: 'Machine Learning for Data Science', domain: 'Data Science', difficulty: 'Intermediate', duration: '4 weeks', technologies: ['Python', 'Scikit-learn'], skills: ['Python', 'Pandas', 'Statistics'], domainRelevance: 0.9 },
      { id: 'ds10', title: 'Business Intelligence Fundamentals', domain: 'Business Intelligence', difficulty: 'Beginner', duration: '2 weeks', technologies: ['Power BI', 'Tableau'], skills: [], domainRelevance: 0.95 },
      { id: 'ds11', title: 'Advanced Statistics & Modeling', domain: 'Statistics', difficulty: 'Advanced', duration: '4 weeks', technologies: ['R', 'Python', 'Statsmodels'], skills: ['Statistics', 'Python'], domainRelevance: 0.9 },
      { id: 'ds12', title: 'Data Engineering Foundations', domain: 'Data Engineering', difficulty: 'Intermediate', duration: '4 weeks', technologies: ['Python', 'SQL', 'Airflow'], skills: ['SQL', 'Python'], domainRelevance: 0.8 }
    ]
  },

  'Computer Science': {
    id: 'Computer Science',
    icon: '💻',
    desc: 'Full-Stack & Systems',
    capabilities: {
      'Programming': ['Python', 'Java', 'C++', 'JavaScript'],
      'Computer Science': ['Data Structures', 'Algorithms', 'Object-Oriented Programming', 'Operating Systems', 'Computer Networks', 'Database Systems'],
      'Software Development': ['Git/GitHub', 'REST APIs', 'Testing', 'Software Architecture'],
      'Web/Systems': ['HTML/CSS', 'JavaScript', 'React', 'Backend Development', 'Cloud Computing']
    },
    tools: ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Git', 'SQL', 'Docker'],
    domains: [
      'Full-Stack Development', 'Backend Development', 'Frontend Development',
      'Software Engineering', 'Cloud Computing', 'DevOps', 'Cybersecurity',
      'Mobile Development', 'System Design', 'Data Structures & Algorithms'
    ],
    specializations: [
      'Software Engineering', 'Full Stack', 'Backend', 'Frontend',
      'Cloud', 'DevOps', 'System Design', 'Cybersecurity', 'Algorithms'
    ],
    careerGoals: [
      'Full-Stack Developer', 'Backend Developer', 'Frontend Developer',
      'Software Engineer', 'Cloud Architect', 'DevOps Engineer',
      'Systems Engineer', 'Mobile Developer', 'Security Engineer'
    ],
    recommendedCourses: [
      { id: 'cs1', title: 'Programming Fundamentals', domain: 'Programming', difficulty: 'Beginner', duration: '3 weeks', technologies: ['Python', 'Java'], skills: [], domainRelevance: 0.8 },
      { id: 'cs2', title: 'Data Structures & Algorithms', domain: 'Computer Science', difficulty: 'Intermediate', duration: '6 weeks', technologies: ['Python', 'Java'], skills: ['Python'], domainRelevance: 1.0 },
      { id: 'cs3', title: 'Object-Oriented Programming', domain: 'Computer Science', difficulty: 'Beginner', duration: '3 weeks', technologies: ['Java', 'Python'], skills: [], domainRelevance: 0.9 },
      { id: 'cs4', title: 'JavaScript Complete Guide', domain: 'Web/Systems', difficulty: 'Beginner', duration: '4 weeks', technologies: ['JavaScript', 'HTML/CSS'], skills: ['HTML/CSS'], domainRelevance: 0.95 },
      { id: 'cs5', title: 'React Frontend Development', domain: 'Web/Systems', difficulty: 'Intermediate', duration: '4 weeks', technologies: ['React', 'JavaScript'], skills: ['JavaScript', 'HTML/CSS'], domainRelevance: 1.0 },
      { id: 'cs6', title: 'Node.js Backend Development', domain: 'Web/Systems', difficulty: 'Intermediate', duration: '4 weeks', technologies: ['Node.js', 'Express', 'JavaScript'], skills: ['JavaScript'], domainRelevance: 0.95 },
      { id: 'cs7', title: 'Database Systems & SQL', domain: 'Computer Science', difficulty: 'Beginner', duration: '3 weeks', technologies: ['SQL', 'PostgreSQL'], skills: [], domainRelevance: 0.9 },
      { id: 'cs8', title: 'Operating Systems Concepts', domain: 'Computer Science', difficulty: 'Intermediate', duration: '4 weeks', technologies: ['Linux'], skills: ['Python'], domainRelevance: 0.85 },
      { id: 'cs9', title: 'System Design for Engineers', domain: 'Software Engineering', difficulty: 'Advanced', duration: '4 weeks', technologies: [], skills: ['Software Architecture'], domainRelevance: 1.0 },
      { id: 'cs10', title: 'Cloud Computing with AWS', domain: 'Cloud Computing', difficulty: 'Intermediate', duration: '4 weeks', technologies: ['AWS', 'Docker'], skills: ['Python'], domainRelevance: 0.9 },
      { id: 'cs11', title: 'DevOps & CI/CD Pipeline', domain: 'DevOps', difficulty: 'Intermediate', duration: '3 weeks', technologies: ['Docker', 'Jenkins', 'Git'], skills: ['Git/GitHub'], domainRelevance: 0.9 },
      { id: 'cs12', title: 'REST API Design & Development', domain: 'Software Development', difficulty: 'Intermediate', duration: '2 weeks', technologies: ['Node.js', 'Python', 'Flask'], skills: ['JavaScript', 'Python'], domainRelevance: 0.9 },
      { id: 'cs13', title: 'Git & GitHub Mastery', domain: 'Software Development', difficulty: 'Beginner', duration: '1 week', technologies: ['Git', 'GitHub'], skills: [], domainRelevance: 0.85 },
      { id: 'cs14', title: 'Software Testing Fundamentals', domain: 'Software Development', difficulty: 'Intermediate', duration: '2 weeks', technologies: ['Python', 'Jest'], skills: ['Python', 'JavaScript'], domainRelevance: 0.85 }
    ]
  }
};

export const DAILY_TIME_OPTIONS = [
  { value: 15, label: '15 min/day' },
  { value: 30, label: '30 min/day' },
  { value: 45, label: '45 min/day' },
  { value: 60, label: '1 hour/day' },
  { value: 90, label: '1.5 hours/day' },
  { value: 120, label: '2 hours/day' },
  { value: 180, label: '3+ hours/day' }
];

export const DURATION_OPTIONS = [
  { value: 1, label: '1 month' },
  { value: 2, label: '2 months' },
  { value: 3, label: '3 months' },
  { value: 4, label: '4 months' },
  { value: 6, label: '6 months' },
  { value: 9, label: '9 months' },
  { value: 12, label: '12 months' }
];

export const DAY_OPTIONS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const DEFAULT_PROFILE = {
  name: '',
  selectedStream: '',
  selectedDomains: [],
  specializationTags: [],
  capabilities: {},
  tools: [],
  programmingLanguages: [],
  careerGoal: '',
  targetRole: '',
  currentLevel: '',
  dailyStudyMinutes: 60,
  studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  preferredStudyTime: 'Morning',
  targetMonths: 3,
  domainRating: 0,
  onboardingComplete: false,
  notifications: [],
  progress: {
    completedCourses: [],
    completedPhases: [],
    currentCourse: null,
    currentPhase: 0,
    phaseProgress: {},
    streakDays: 0,
    weeklyMinutesStudied: 0,
    totalMinutesStudied: 0,
    lastStudyDate: null
  },
  notificationSettings: {
    dailyReminder: true,
    weeklyProgress: true,
    missedSession: true,
    streakReminder: true,
    courseCompletion: true,
    roadmapUpdates: true,
    courseRecommendations: true,
    deadlineReminder: true,
    reminderTime: '09:00 AM'
  }
};

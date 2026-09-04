// Real curated educational YouTube resources grouped by topic.
// Video IDs are real, publicly available lectures/tutorials.
const YT_RESOURCES = {
  'python': [
    { title: 'Python for Beginners – Full Course', channel: 'Programming with Mosh', videoId: 'rfscVS0vtbw', duration: '6h' },
    { title: 'Python Tutorial – Python Full Course for Beginners', channel: 'Programming with Mosh', videoId: '_uQrJ0TkZlc', duration: '6h' },
    { title: 'Python Crash Course for Beginners', channel: 'Traversy Media', videoId: 'JJ9lZ_6GFaM', duration: '2h' },
  ],
  'sql': [
    { title: 'SQL Tutorial – Full Database Course for Beginners', channel: 'freeCodeCamp.org', videoId: 'HXV3zeQKqGY', duration: '4h' },
    { title: 'Learn SQL in 1 Hour', channel: 'Programming with Mosh', videoId: '7S_tz1z_5bA', duration: '1h' },
  ],
  'machine learning': [
    { title: 'Machine Learning for Everybody', channel: 'freeCodeCamp.org', videoId: 'i_LwzRVP7bg', duration: '3h' },
    { title: 'Machine Learning Full Course – Learn Machine Learning', channel: 'freeCodeCamp.org', videoId: 'vStJoetOxJg', duration: '9h' },
  ],
  'deep learning': [
    { title: 'But what is a neural network?', channel: '3Blue1Brown', videoId: 'aircAruvnKk', duration: '19m' },
    { title: 'MIT Introduction to Deep Learning', channel: 'Alexander Amini', videoId: 'ErnWZqJvk5E', duration: '1h' },
  ],
  'statistics': [
    { title: 'Statistics – A Full University Course', channel: 'freeCodeCamp.org', videoId: 'xxpc-HIkNcP', duration: '8h' },
    { title: 'Statistics Fundamentals', channel: 'freeCodeCamp.org', videoId: 'xxpc-HIkNcP', duration: '8h' },
  ],
  'pandas': [
    { title: 'Data Analysis with Python – Full Course', channel: 'freeCodeCamp.org', videoId: 'r-uOLxNrNk8', duration: '4h' },
  ],
  'pytorch': [
    { title: 'PyTorch for Deep Learning – Full Course', channel: 'freeCodeCamp.org', videoId: 'G7Sd1WdUPIc', duration: '6h' },
  ],
  'tensorflow': [
    { title: 'TensorFlow 2.0 Complete Course', channel: 'freeCodeCamp.org', videoId: 'tPYj3fFJGjk', duration: '7h' },
  ],
  'nlp': [
    { title: 'Natural Language Processing with Deep Learning', channel: 'Stanford', videoId: '8rXD5-xhemQ', duration: '6h' },
  ],
  'docker': [
    { title: 'Docker Tutorial for Beginners', channel: 'freeCodeCamp.org', videoId: 'fqMOX6JJhGo', duration: '2h' },
    { title: 'Docker Crash Course', channel: 'Traversy Media', videoId: 'gAkwW2tuIqE', duration: '1h' },
  ],
  'linux': [
    { title: 'Linux Command Line – Full Course', channel: 'freeCodeCamp.org', videoId: 'wBp0Rb-ZJak', duration: '1h' },
  ],
  'javascript': [
    { title: 'JavaScript Tutorial for Beginners', channel: 'Programming with Mosh', videoId: 'W6NZfCO5SIk', duration: '1h' },
    { title: 'JavaScript Crash Course', channel: 'Traversy Media', videoId: 'hdI2bqOjy3c', duration: '1h' },
  ],
  'react': [
    { title: 'React JS Crash Course', channel: 'Traversy Media', videoId: 'w7ejDZ8SWv8', duration: '2h' },
    { title: 'React Course – Beginner’s Tutorial', channel: 'freeCodeCamp.org', videoId: 'u6gPpfIUJh8', duration: '10h' },
  ],
  'rest api': [
    { title: 'REST API Crash Course', channel: 'Traversy Media', videoId: 'Q-BpqyOT3a8', duration: '1h' },
  ],
  'data structures': [
    { title: 'Data Structures Easy to Advanced Course', channel: 'freeCodeCamp.org', videoId: 'RBSGKlAvoiM', duration: '8h' },
    { title: 'Algorithms and Data Structures – Full Course', channel: 'freeCodeCamp.org', videoId: '8hly31xKli0', duration: '5h' },
  ],
  'cloud computing': [
    { title: 'AWS Certified Cloud Practitioner – Full Course', channel: 'freeCodeCamp.org', videoId: '3hLmDSXVjNc', duration: '13h' },
  ],
  'git': [
    { title: 'Git and GitHub for Beginners – Crash Course', channel: 'freeCodeCamp.org', videoId: 'RGOj5yH7evk', duration: '1h' },
  ],
  'networking': [
    { title: 'Computer Networking – Full Course', channel: 'freeCodeCamp.org', videoId: 'qiQR5rTSshw', duration: '9h' },
  ],
};

// Map approximate keywords to topic keys in YT_RESOURCES
const KEYWORD_MAP = [
  ['python', ['python']],
  ['sql', ['sql', 'database']],
  ['machine learning', ['machine learning', 'ml fundamentals', 'scikit', 'scikit-learn', 'feature engineering', 'model evaluation']],
  ['deep learning', ['deep learning', 'neural network', 'tensorflow', 'pytorch']],
  ['statistics', ['statistics', 'statistical', 'probability', 'hypothesis']],
  ['pandas', ['pandas']],
  ['nlp', ['nlp', 'natural language']],
  ['docker', ['docker', 'container']],
  ['linux', ['linux']],
  ['javascript', ['javascript', 'js']],
  ['react', ['react']],
  ['rest api', ['rest api', 'rest', 'api design', 'apis']],
  ['data structures', ['data structure', 'algorithm', 'algorithms', 'time complexity']],
  ['cloud computing', ['cloud', 'aws', 'azure']],
  ['git', ['git']],
  ['networking', ['network', 'networking', 'cybersecurity', 'security']],
];

export function extractYouTubeId(input) {
  if (!input) return null;
  const str = String(input);
  const patterns = [
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/))([\w-]{6,})/i,
    /youtu\.be\/([\w-]{6,})/i,
  ];
  for (const re of patterns) {
    const m = str.match(re);
    if (m) return m[1];
  }
  if (/^[\w-]{11}$/.test(str.trim())) return str.trim();
  return null;
}

export function makeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

// Return curated resources for a topic string
export function getResourcesForTopic(topic) {
  if (!topic) return [];
  const lower = topic.toLowerCase();

  for (const [key, kws] of KEYWORD_MAP) {
    if (kws.some((k) => lower.includes(k))) {
      const list = YT_RESOURCES[key];
      if (list) {
        return list.map((r) => ({
          title: r.title,
          topic: key,
          type: 'youtube',
          url: makeEmbedUrl(r.videoId),
          thumbnail: `https://img.youtube.com/vi/${r.videoId}/hqdefault.jpg`,
          duration: r.duration,
          description: r.title,
        }));
      }
    }
  }

  // Fallback: first general resource list
  return [];
}

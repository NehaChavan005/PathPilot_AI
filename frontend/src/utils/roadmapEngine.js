import { STREAMS } from '../config/streamConfig';

function getSkillGapLevel(proficiency) {
  if (proficiency >= 75) return 'advanced';
  if (proficiency >= 50) return 'intermediate';
  if (proficiency >= 25) return 'basic';
  return 'beginner';
}

function sortCoursesByPriority(courses, capabilities, selectedDomains) {
  return [...courses].sort((a, b) => {
    const aDomainMatch = selectedDomains.some(d =>
      a.domain.toLowerCase().includes(d.toLowerCase()) ||
      d.toLowerCase().includes(a.domain.toLowerCase())
    ) ? 1 : 0;
    const bDomainMatch = selectedDomains.some(d =>
      b.domain.toLowerCase().includes(d.toLowerCase()) ||
      d.toLowerCase().includes(b.domain.toLowerCase())
    ) ? 1 : 0;

    if (aDomainMatch !== bDomainMatch) return bDomainMatch - aDomainMatch;

    const aPrereqMet = a.skills.every(s => (capabilities[s] || 0) >= 30) ? 1 : 0;
    const bPrereqMet = b.skills.every(s => (capabilities[s] || 0) >= 30) ? 1 : 0;

    if (aPrereqMet !== bPrereqMet) return bPrereqMet - aPrereqMet;

    const aGapNeed = a.skills.reduce((sum, s) => sum + Math.max(0, 50 - (capabilities[s] || 0)), 0);
    const bGapNeed = b.skills.reduce((sum, s) => sum + Math.max(0, 50 - (capabilities[s] || 0)), 0);

    if (aGapNeed !== bGapNeed) return bGapNeed - aGapNeed;

    return (b.domainRelevance || 0) - (a.domainRelevance || 0);
  });
}

function estimateCourseWeeks(course, dailyMinutes) {
  const durationMap = {
    '1 week': 1,
    '2 weeks': 2,
    '3 weeks': 3,
    '4 weeks': 4,
    '5 weeks': 5,
    '6 weeks': 6,
    '7 weeks': 7,
    '8 weeks': 8,
    '10 weeks': 10,
    '12 weeks': 12
  };
  const baseWeeks = durationMap[course.duration] || 4;
  if (dailyMinutes >= 120) return Math.max(1, Math.ceil(baseWeeks * 0.7));
  if (dailyMinutes >= 60) return baseWeeks;
  if (dailyMinutes >= 30) return Math.ceil(baseWeeks * 1.3);
  return Math.ceil(baseWeeks * 1.6);
}

export function generateRoadmap(profile) {
  const { selectedStream, capabilities, selectedDomains, dailyStudyMinutes, targetMonths } = profile;

  if (!selectedStream || !STREAMS[selectedStream]) return null;

  const streamConfig = STREAMS[selectedStream];
  const allCourses = streamConfig.recommendedCourses;
  const sortedCourses = sortCoursesByPriority(allCourses, capabilities, selectedDomains);

  const totalWeeks = targetMonths * 4.33;
  const maxCoursesForTime = Math.max(2, Math.floor((totalWeeks) / 2));

  const selectedCourses = sortedCourses.slice(0, Math.min(maxCoursesForTime, sortedCourses.length));

  const beginnerCourses = selectedCourses.filter(c => c.difficulty === 'Beginner');
  const intermediateCourses = selectedCourses.filter(c => c.difficulty === 'Intermediate');
  const advancedCourses = selectedCourses.filter(c => c.difficulty === 'Advanced');

  const phases = [];

  if (beginnerCourses.length > 0) {
    const phaseWeeks = beginnerCourses.reduce((sum, c) => sum + estimateCourseWeeks(c, dailyStudyMinutes), 0);
    phases.push({
      id: 1,
      phase: 'Phase 1',
      title: 'Foundations',
      status: 'In Progress',
      duration: `${Math.max(1, Math.round(phaseWeeks))} Weeks`,
      progress: 0,
      courses: beginnerCourses,
      skills: [...new Set(beginnerCourses.flatMap(c => c.technologies || []))].slice(0, 6),
      optional: false
    });
  }

  if (intermediateCourses.length > 0) {
    const phaseWeeks = intermediateCourses.reduce((sum, c) => sum + estimateCourseWeeks(c, dailyStudyMinutes), 0);
    phases.push({
      id: phases.length + 1,
      phase: `Phase ${phases.length + 1}`,
      title: 'Core Skills',
      status: phases.length === 0 ? 'Locked' : 'Locked',
      duration: `${Math.max(1, Math.round(phaseWeeks))} Weeks`,
      courses: intermediateCourses,
      skills: [...new Set(intermediateCourses.flatMap(c => c.technologies || []))].slice(0, 6),
      optional: false
    });
  }

  if (advancedCourses.length > 0) {
    const phaseWeeks = advancedCourses.reduce((sum, c) => sum + estimateCourseWeeks(c, dailyStudyMinutes), 0);
    phases.push({
      id: phases.length + 1,
      phase: `Phase ${phases.length + 1}`,
      title: 'Specialization',
      status: 'Locked',
      duration: `${Math.max(1, Math.round(phaseWeeks))} Weeks`,
      courses: advancedCourses,
      skills: [...new Set(advancedCourses.flatMap(c => c.technologies || []))].slice(0, 6),
      optional: false
    });
  }

  if (selectedDomains.length > 0) {
    phases.push({
      id: phases.length + 1,
      phase: `Phase ${phases.length + 1}`,
      title: 'Projects & Portfolio',
      status: 'Locked',
      duration: '4 Weeks',
      courses: [],
      skills: selectedDomains.slice(0, 4),
      optional: false,
      isProjectPhase: true
    });
  }

  const totalEstimatedWeeks = phases.reduce((sum, p) => {
    const weeks = parseInt(p.duration) || 4;
    return sum + weeks;
  }, 0);

  return {
    phases,
    totalWeeks: totalEstimatedWeeks,
    stream: selectedStream,
    domains: selectedDomains
  };
}

export function getRecommendedCourses(profile) {
  const { selectedStream, capabilities, selectedDomains } = profile;

  if (!selectedStream || !STREAMS[selectedStream]) return [];

  const streamConfig = STREAMS[selectedStream];
  const sortedCourses = sortCoursesByPriority(streamConfig.recommendedCourses, capabilities, selectedDomains);

  return sortedCourses.map(course => {
    const prereqMet = course.skills.every(s => (capabilities[s] || 0) >= 25);
    const isDomainRelevant = selectedDomains.some(d =>
      course.domain.toLowerCase().includes(d.toLowerCase()) ||
      d.toLowerCase().includes(course.domain.toLowerCase())
    );

    let reason = '';
    if (isDomainRelevant) reason = 'Matches your domain interest';
    else if (!prereqMet) reason = 'Builds prerequisite skills';
    else reason = 'Recommended for your stream';

    return {
      ...course,
      recommended: isDomainRelevant || !prereqMet,
      reason
    };
  });
}

export function generateDailyPlan(profile) {
  const { dailyStudyMinutes, capabilities, selectedStream, selectedDomains } = profile;

  if (!selectedStream || !STREAMS[selectedStream]) return [];

  const streamConfig = STREAMS[selectedStream];
  const sortedCourses = getRecommendedCourses(profile);

  const beginnerLevel = Object.values(capabilities).length > 0
    ? Object.values(capabilities).reduce((a, b) => a + b, 0) / Object.values(capabilities).length
    : 0;

  const recommended = sortedCourses.filter(c => c.recommended).slice(0, 3);

  const tasks = [];
  let remaining = dailyStudyMinutes;

  if (beginnerLevel < 40 && recommended.length > 0) {
    tasks.push({
      title: recommended[0].title,
      duration: Math.min(remaining, Math.floor(dailyStudyMinutes * 0.45)),
      type: 'course',
      course: recommended[0]
    });
    remaining -= tasks[tasks.length - 1].duration;
  } else if (recommended.length > 0) {
    tasks.push({
      title: recommended[0].title,
      duration: Math.min(remaining, Math.floor(dailyStudyMinutes * 0.4)),
      type: 'course',
      course: recommended[0]
    });
    remaining -= tasks[tasks.length - 1].duration;
  }

  if (recommended.length > 1 && remaining > 10) {
    tasks.push({
      title: recommended[1].title,
      duration: Math.min(remaining, Math.floor(dailyStudyMinutes * 0.35)),
      type: 'course',
      course: recommended[1]
    });
    remaining -= tasks[tasks.length - 1].duration;
  }

  if (remaining >= 10) {
    tasks.push({
      title: 'Practice & Review',
      duration: remaining,
      type: 'practice'
    });
  }

  return tasks;
}

export function calculateProgress(profile) {
  const { progress, selectedStream } = profile;
  if (!progress || !selectedStream) return 0;

  const completed = progress.completedCourses?.length || 0;
  const streamConfig = STREAMS[selectedStream];
  if (!streamConfig) return 0;

  const total = streamConfig.recommendedCourses.length;
  if (total === 0) return 0;

  const phaseBonus = (progress.currentPhase || 0) * 5;
  const courseProgress = (completed / total) * 100;

  return Math.min(100, Math.round(courseProgress + phaseBonus));
}

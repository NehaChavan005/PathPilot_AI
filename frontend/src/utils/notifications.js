export function generateNotifications(profile) {
  const notifications = [];

  if (!profile.onboardingComplete) {
    notifications.push({
      id: 'onboarding-reminder',
      message: 'Complete your onboarding to get a personalized learning path!',
      type: 'reminder',
      read: false,
      timestamp: new Date().toISOString()
    });
    return notifications;
  }

  const today = new Date();
  const lastStudy = profile.progress?.lastStudyDate ? new Date(profile.progress.lastStudyDate) : null;
  const daysSinceLastStudy = lastStudy ? Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24)) : 0;

  if (daysSinceLastStudy > 1) {
    notifications.push({
      id: 'missed-session',
      message: `You missed ${daysSinceLastStudy} learning session${daysSinceLastStudy > 1 ? 's' : ''}. Your roadmap has been adjusted.`,
      type: 'warning',
      read: false,
      timestamp: today.toISOString()
    });
  }

  if (profile.progress?.streakDays > 0) {
    notifications.push({
      id: 'streak',
      message: `You're on a ${profile.progress.streakDays}-day learning streak! Keep it up!`,
      type: 'success',
      read: false,
      timestamp: today.toISOString()
    });
  }

  const weeklyCompleted = profile.progress?.weeklyMinutesStudied || 0;
  const weeklyTarget = profile.dailyStudyMinutes * profile.studyDays.length;
  if (weeklyTarget > 0 && weeklyCompleted > 0) {
    const weeklyPercent = Math.round((weeklyCompleted / weeklyTarget) * 100);
    if (weeklyPercent >= 80 && weeklyPercent < 100) {
      notifications.push({
        id: 'weekly-progress',
        message: `You're only ${weeklyTarget - weeklyCompleted} minutes away from your weekly goal!`,
        type: 'info',
        read: false,
        timestamp: today.toISOString()
      });
    } else if (weeklyPercent >= 100) {
      notifications.push({
        id: 'weekly-complete',
        message: 'Congratulations! You completed your weekly learning target!',
        type: 'success',
        read: false,
        timestamp: today.toISOString()
      });
    }
  }

  const completedCourses = profile.progress?.completedCourses || [];
  if (completedCourses.length > 0) {
    notifications.push({
      id: 'course-completed',
      message: `You've completed ${completedCourses.length} course${completedCourses.length > 1 ? 's' : ''}. Great progress!`,
      type: 'success',
      read: false,
      timestamp: today.toISOString()
    });
  }

  if (profile.targetMonths) {
    const estimatedEndDate = new Date();
    estimatedEndDate.setMonth(estimatedEndDate.getMonth() + profile.targetMonths);
    const daysUntilEnd = Math.ceil((estimatedEndDate - today) / (1000 * 60 * 60 * 24));
    if (daysUntilEnd <= 30 && daysUntilEnd > 0) {
      notifications.push({
        id: 'deadline-approaching',
        message: `Your target completion date is ${daysUntilEnd} days away. Keep pushing!`,
        type: 'warning',
        read: false,
        timestamp: today.toISOString()
      });
    }
  }

  notifications.push({
    id: 'daily-reminder',
    message: `You have ${profile.dailyStudyMinutes} minutes of learning planned today.`,
    type: 'info',
    read: false,
    timestamp: today.toISOString()
  });

  return notifications;
}

export function getNotificationColor(type) {
  switch (type) {
    case 'success': return 'text-green-600 bg-green-50';
    case 'warning': return 'text-amber-600 bg-amber-50';
    case 'error': return 'text-red-600 bg-red-50';
    case 'reminder': return 'text-blue-600 bg-blue-50';
    default: return 'text-indigo-600 bg-indigo-50';
  }
}

export function getNotificationIcon(type) {
  switch (type) {
    case 'success': return '✓';
    case 'warning': return '⚠';
    case 'error': return '✕';
    case 'reminder': return '🔔';
    default: return 'ℹ';
  }
}

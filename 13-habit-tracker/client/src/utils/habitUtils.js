// client/src/utils/habitUtils.js
// Utility functions for habit date formatting, streak calculation, and weekly view generation

/**
 * Formats a Date object or date string to local YYYY-MM-DD
 */
export const formatDateKey = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Checks if a habit was completed on a specific date (compared in local YYYY-MM-DD)
 */
export const isCompletedOnDate = (completedDates, targetDate) => {
  if (!Array.isArray(completedDates)) return false;
  const targetKey = formatDateKey(targetDate);
  return completedDates.some((d) => formatDateKey(d) === targetKey);
};

/**
 * Checks if a habit is completed today
 */
export const isCompletedToday = (completedDates) => {
  return isCompletedOnDate(completedDates, new Date());
};

/**
 * Returns an array of the last 7 days ending on today
 */
export const getLast7Days = () => {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    days.push({
      date: d,
      dateKey: formatDateKey(d),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
    });
  }

  return days;
};

/**
 * Returns the Monday (start of week) in YYYY-MM-DD format for a given date
 */
const getWeekMondayKey = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday, ...
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return formatDateKey(d);
};

/**
 * Calculates the current streak for a habit (Daily or Weekly)
 */
export const calculateStreak = (habit) => {
  if (!habit || !Array.isArray(habit.completedDates) || habit.completedDates.length === 0) {
    return { count: 0, label: habit?.frequency === 'weekly' ? '0 weeks' : '0 days' };
  }

  const frequency = habit.frequency || 'daily';

  if (frequency === 'daily') {
    // Collect unique completed date strings
    const completedSet = new Set(habit.completedDates.map(formatDateKey));
    const today = new Date();
    const todayKey = formatDateKey(today);
    const completedToday = completedSet.has(todayKey);

    let streak = 0;
    const checkDate = new Date(today);

    if (completedToday) {
      // Completed today -> streak includes today and looks backwards
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
      while (completedSet.has(formatDateKey(checkDate))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else {
      // Not completed today -> check if yesterday was completed (streak still active for today)
      checkDate.setDate(checkDate.getDate() - 1);
      if (completedSet.has(formatDateKey(checkDate))) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
        while (completedSet.has(formatDateKey(checkDate))) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      } else {
        streak = 0;
      }
    }

    return {
      count: streak,
      label: `${streak} ${streak === 1 ? 'day' : 'days'}`,
    };
  }

  // Weekly habit streak calculation
  const completedWeeks = new Set(habit.completedDates.map(getWeekMondayKey));
  const today = new Date();
  const currentWeekMonday = getWeekMondayKey(today);
  const completedCurrentWeek = completedWeeks.has(currentWeekMonday);

  let streak = 0;
  const checkWeekDate = new Date(today);

  if (completedCurrentWeek) {
    streak = 1;
    // Check previous weeks
    checkWeekDate.setDate(checkWeekDate.getDate() - 7);
    while (completedWeeks.has(getWeekMondayKey(checkWeekDate))) {
      streak++;
      checkWeekDate.setDate(checkWeekDate.getDate() - 7);
    }
  } else {
    // Current week not completed yet -> check if last week was completed
    checkWeekDate.setDate(checkWeekDate.getDate() - 7);
    if (completedWeeks.has(getWeekMondayKey(checkWeekDate))) {
      streak = 1;
      checkWeekDate.setDate(checkWeekDate.getDate() - 7);
      while (completedWeeks.has(getWeekMondayKey(checkWeekDate))) {
        streak++;
        checkWeekDate.setDate(checkWeekDate.getDate() - 7);
      }
    } else {
      streak = 0;
    }
  }

  return {
    count: streak,
    label: `${streak} ${streak === 1 ? 'week' : 'weeks'}`,
  };
};


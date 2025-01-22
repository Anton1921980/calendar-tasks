import moment from 'moment';

export const getCalendarDays = (date: moment.Moment) => {
  const monthStart = date.clone().startOf('month');
  const monthEnd = date.clone().endOf('month');
  const calendarStart = monthStart.clone().startOf('week');
  const calendarEnd = monthEnd.clone().endOf('week');

  const days: Array<{
    date: moment.Moment;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
  }> = [];

  const day = calendarStart.clone();
  while (day.isSameOrBefore(calendarEnd)) {
    days.push({
      date: day.clone(),
      isCurrentMonth: day.isSame(date, 'month'),
      isToday: day.isSame(moment(), 'day'),
      isSelected: false
    });
    day.add(1, 'day');
  }

  return days;
};

export const formatDate = (date: moment.Moment, formatString: string = 'YYYY-MM-DD') => {
  return date.format(formatString);
};
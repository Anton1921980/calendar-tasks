export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
  }
  
  export interface Task {
    id: string;
    text: string;
    date: string;
    order: number;
  }
  
  export interface Holiday {
    date: string;
    name: string;
    type: string;
  }
export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
  }
  
  export interface Task {
    _id: string;
    text: string;
    date: string;
    order: number;
    userId: string;
  }
  
  export interface Holiday {
    date: string;
    name: string;
    type: string;
  }
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  text: string;
  date: string;
  order: number;
}

interface TasksState {
  tasks: Record<string, Task[]>;
}

const initialState: TasksState = {
  tasks: {}
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      const { date } = action.payload;
      if (!state.tasks[date]) {
        state.tasks[date] = [];
      }
      state.tasks[date].push(action.payload);
    },
    moveTask: (state, action: PayloadAction<{
      taskId: string;
      fromDate: string;
      toDate: string;
      newOrder: number;
    }>) => {
      const { taskId, fromDate, toDate, newOrder } = action.payload;
      const task = state.tasks[fromDate]?.find(t => t.id === taskId);
      
      if (task) {
        // Remove from old date
        state.tasks[fromDate] = state.tasks[fromDate].filter(t => t.id !== taskId);
        
        // Add to new date
        if (!state.tasks[toDate]) {
          state.tasks[toDate] = [];
        }
        
        const updatedTask = { ...task, date: toDate, order: newOrder };
        state.tasks[toDate].push(updatedTask);
        
        // Reorder tasks
        state.tasks[toDate].sort((a, b) => a.order - b.order);
      }
    },
    reorderTasks: (state, action: PayloadAction<{
      date: string;
      taskIds: string[];
    }>) => {
      const { date, taskIds } = action.payload;
      if (state.tasks[date]) {
        state.tasks[date] = taskIds.map((id, index) => {
          const task = state.tasks[date].find(t => t.id === id);
          return task ? { ...task, order: index } : task!;
        });
      }
    }
  }
});

export const { addTask, moveTask, reorderTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
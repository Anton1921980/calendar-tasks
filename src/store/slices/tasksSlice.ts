import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  text: string;
  date: string;
  order: number;
}

interface TasksState {
  [date: string]: Task[];
}

interface MoveTaskPayload {
  taskId: string;
  fromDate: string;
  toDate: string;
  newOrder: number;
  newText?: string;
}

interface ReorderTasksPayload {
  date: string;
  taskIds: string[];
}

const initialState: TasksState = {};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      const { date } = action.payload;
      if (!state[date]) {
        state[date] = [];
      }
      state[date].push(action.payload);
    },
    deleteTask: (state, action: PayloadAction<{ taskId: string; date: string }>) => {
      const { taskId, date } = action.payload;
      if (state[date]) {
        state[date] = state[date].filter(task => task.id !== taskId);
      }
    },
    moveTask: (state, action: PayloadAction<MoveTaskPayload>) => {
      const { taskId, fromDate, toDate, newOrder, newText } = action.payload;
      
      if (!state[fromDate]) return;
      
      const taskIndex = state[fromDate].findIndex(task => task.id === taskId);
      if (taskIndex === -1) return;
      
      const task = { ...state[fromDate][taskIndex] };
      if (newText !== undefined) {
        task.text = newText;
      }
      
      if (fromDate === toDate) {
        state[fromDate][taskIndex] = task;
      } else {
        state[fromDate].splice(taskIndex, 1);
        if (!state[toDate]) {
          state[toDate] = [];
        }
        task.date = toDate;
        task.order = newOrder;
        state[toDate].push(task);
      }
    },
    reorderTasks: (state, action: PayloadAction<ReorderTasksPayload>) => {
      const { date, taskIds } = action.payload;
      if (!state[date]) return;
      
      const tasksMap = new Map(state[date].map(task => [task.id, task]));
      state[date] = taskIds
        .map((id, index) => {
          const task = tasksMap.get(id);
          if (task) {
            return { ...task, order: index };
          }
          return null;
        })
        .filter((task): task is Task => task !== null);
    },
  },
});

export const { addTask, deleteTask, moveTask, reorderTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
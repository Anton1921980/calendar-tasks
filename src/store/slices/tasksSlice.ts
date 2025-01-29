import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as tasksApi from '../../api/tasks';

export interface Task {
  _id: string;
  text: string;
  date: string;
  order: number;
  userId: string;
}

export type NewTask = Omit<Task, '_id' | 'userId'>;

interface TasksState {
  items: { [date: string]: Task[] };
  loading: boolean;
  error: string | null;
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

const initialState: TasksState = {
  items: {},
  loading: false,
  error: null
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await tasksApi.getTasks();
    return response;
  }
);

export const createTask = createAsyncThunk<Task, Omit<Task, '_id' | 'userId'>>(
  'tasks/createTask',
  async (task) => {
    const response = await tasksApi.createTask(task);
    return response;
  }
);

export const updateTaskThunk = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
    const response = await tasksApi.updateTask(taskId, updates);
    return response;
  }
);

export const deleteTaskThunk = createAsyncThunk(
  'tasks/deleteTask',
  async ({ taskId }: { taskId: string }) => {
    await tasksApi.deleteTask(taskId);
    return taskId;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      const { date } = action.payload;
      if (!state.items[date]) {
        state.items[date] = [];
      }
      state.items[date].push(action.payload);
    },
    deleteTask: (state, action: PayloadAction<{ taskId: string; date: string }>) => {
      const { taskId, date } = action.payload;
      if (state.items[date]) {
        state.items[date] = state.items[date].filter(task => task._id !== taskId);
      }
    },
    moveTask: (state, action: PayloadAction<MoveTaskPayload>) => {
      const { taskId, fromDate, toDate, newOrder, newText } = action.payload;
      
      if (!state.items[fromDate]) return;
      
      const taskIndex = state.items[fromDate].findIndex(task => task._id === taskId);
      if (taskIndex === -1) return;
      
      const task = { ...state.items[fromDate][taskIndex] };
      if (newText !== undefined) {
        task.text = newText;
      }
      
      if (fromDate === toDate) {
        state.items[fromDate][taskIndex] = task;
      } else {
        state.items[fromDate].splice(taskIndex, 1);
        if (!state.items[toDate]) {
          state.items[toDate] = [];
        }
        task.date = toDate;
        task.order = newOrder;
        state.items[toDate].push(task);
      }
    },
    reorderTasks: (state, action: PayloadAction<ReorderTasksPayload>) => {
      const { date, taskIds } = action.payload;
      if (!state.items[date]) return;
      
      const tasksMap = new Map(state.items[date].map(task => [task._id, task]));
      state.items[date] = taskIds
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
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.items = action.payload.reduce<{ [key: string]: Task[] }>((acc, task) => {
          if (!acc[task.date]) {
            acc[task.date] = [];
          }
          acc[task.date].push(task);
          return acc;
        }, {});
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const task = action.payload;
        if (!state.items[task.date]) {
          state.items[task.date] = [];
        }
        state.items[task.date].push(task);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create task';
      })
      // Update task
      .addCase(updateTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskThunk.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const updatedTask = action.payload;
        const tasks = state.items[updatedTask.date];
        if (tasks) {
          const index = tasks.findIndex(task => task._id === updatedTask._id);
          if (index !== -1) {
            tasks[index] = updatedTask;
          }
        }
      })
      .addCase(updateTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      })
      // Delete task
      .addCase(deleteTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // Find and remove the task
        Object.keys(state.items).forEach(date => {
          state.items[date] = state.items[date].filter(task => task._id !== action.payload);
        });
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete task';
      });
  },
});

export const { clearError, addTask, deleteTask, moveTask, reorderTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
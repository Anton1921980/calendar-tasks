import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as tasksApi from '../../api/tasks';
import * as publicTasksApi from '../../api/publicTasks';
import { RootState } from '..';

export interface Task {
  _id: string;
  text: string;
  date: string;
  order: number;
  userId: string;
  status: 'plan' | 'progress' | 'done';
}

export type NewTask = Omit<Task, '_id' | 'userId'>;

interface TasksState {
  items: { [date: string]: Task[] };
  fetchLoading: boolean;
  error: string | null;
}

interface MoveTaskPayload {
  taskId: string;
  fromDate: string;
  toDate: string;
  newOrder: number;
  newText?: string;
  newStatus?: 'plan' | 'progress' | 'done';
}

interface ReorderTasksPayload {
  date: string;
  taskIds: string[];
}

const initialState: TasksState = {
  items: {},
  fetchLoading: false,
  error: null
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;
    
    if (isAuthenticated) {
      return await tasksApi.getTasks();
    } else {
      return await publicTasksApi.getPublicTasks();
    }
  }
);

export const createTask = createAsyncThunk<Task, Omit<Task, '_id' | 'userId'>>(
  'tasks/createTask',
  async (task, { rejectWithValue }) => {
    try {
      const response = await tasksApi.createTask(task);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create task');
    }
  }
);

export const updateTaskThunk = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, fromDate, toDate, newOrder, newText, newStatus }: MoveTaskPayload, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;
    
    // Only check authentication for text/status updates, allow reordering for everyone
    if (!isAuthenticated && (newText !== undefined || newStatus !== undefined)) {
      throw new Error('You need to be authenticated to edit tasks');
    }

    try {
      const updates: Partial<Task> = {
        date: toDate,
        order: newOrder
      };
      if (newText !== undefined) {
        updates.text = newText;
      }
      if (newStatus !== undefined) {
        updates.status = newStatus;
      }

      // For demo mode, just update the local state without API call
      if (!isAuthenticated) {
        const task = state.tasks.items[fromDate]?.find(t => t._id === taskId);
        if (!task) throw new Error('Task not found');
        return {
          ...task,
          ...updates
        };
      }

      // For authenticated users, make the API call
      const response = await tasksApi.updateTask(taskId, updates);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task');
    }
  }
);

export const deleteTaskThunk = createAsyncThunk(
  'tasks/deleteTask',
  async ({ taskId, date }: { taskId: string; date: string }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;
    
    if (!isAuthenticated) {
      throw new Error('You need to be authenticated to delete tasks');
    }
    
    await tasksApi.deleteTask(taskId);
    dispatch(deleteTask({ taskId, date }));
    return { taskId, date };
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
      const { taskId, fromDate, toDate, newOrder, newText, newStatus } = action.payload;
      
      if (!state.items[fromDate]) return;
      
      const taskIndex = state.items[fromDate].findIndex(task => task._id === taskId);
      if (taskIndex === -1) return;
      
      const task = { ...state.items[fromDate][taskIndex] };
      if (newText !== undefined) {
        task.text = newText;
      }
      if (newStatus !== undefined) {
        task.status = newStatus;
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
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.fetchLoading = false;
        const tasks = action.payload.map(task => ({
          ...task,
          status: task.status || 'plan' // Ensure status exists
        }));
        state.items = tasks.reduce<{ [key: string]: Task[] }>((acc, task) => {
          if (!acc[task.date]) {
            acc[task.date] = [];
          }
          acc[task.date].push(task);
          return acc;
        }, {});
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        const { date } = action.payload;
        if (!state.items[date]) {
          state.items[date] = [];
        }
        // Increment the order of existing tasks
        state.items[date] = state.items[date].map(task => ({
          ...task,
          order: task.order + 1
        }));
        // Add the new task at the beginning with order 0
        state.items[date].unshift({
          ...action.payload,
          order: 0
        });
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create task';
      })
      // Update task
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const fromDate = Object.keys(state.items).find(date => 
          state.items[date].some(task => task._id === updatedTask._id)
        );
        
        // Remove from old date if moving between dates
        if (fromDate && fromDate !== updatedTask.date) {
          state.items[fromDate] = state.items[fromDate].filter(
            task => task._id !== updatedTask._id
          );
        }

        // Add/Update in new date
        if (!state.items[updatedTask.date]) {
          state.items[updatedTask.date] = [];
        }

        const existingIndex = state.items[updatedTask.date].findIndex(
          task => task._id === updatedTask._id
        );

        if (existingIndex !== -1) {
          state.items[updatedTask.date][existingIndex] = updatedTask;
        } else {
          state.items[updatedTask.date].push(updatedTask);
        }

        // Sort tasks by order
        state.items[updatedTask.date].sort((a, b) => a.order - b.order);
      })
      .addCase(updateTaskThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task';
      })
      // Delete task
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        const { taskId } = action.payload;
        Object.keys(state.items).forEach(date => {
          state.items[date] = state.items[date].filter(task => task._id !== taskId);
        });
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete task';
      });
  },
});

export const { clearError, addTask, deleteTask, moveTask, reorderTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
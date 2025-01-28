import request from 'supertest';
import mongoose, { Document } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import Task from '../models/Task';

interface TaskDocument extends Document {
  text: string;
  date: string;
  order: number;
  userId: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
}

let mongoServer: MongoMemoryServer;
let authToken: string;
let userId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test user and get token
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });

  authToken = res.body.token;
  userId = res.body.id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear tasks before each test
  await Task.deleteMany({});
});

describe('Tasks API', () => {
  const testTask = {
    text: 'Test task',
    date: '2024-01-29',
    order: 1
  };

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testTask);

      expect(res.status).toBe(201);
      expect(res.body.text).toBe(testTask.text);
      expect(res.body.date).toBe(testTask.date);
      expect(res.body.order).toBe(testTask.order);
      expect(res.body.userId).toBe(userId);
    });

    it('should not create task without authentication', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send(testTask);

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/tasks/date/:date', () => {
    beforeEach(async () => {
      // Create some test tasks
      await Task.create({
        ...testTask,
        userId: new mongoose.Types.ObjectId(userId)
      });

      await Task.create({
        text: 'Another task',
        date: '2024-01-30',
        order: 2,
        userId: new mongoose.Types.ObjectId(userId)
      });
    });

    it('should get tasks for specific date', async () => {
      const res = await request(app)
        .get(`/api/tasks/date/${testTask.date}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].text).toBe(testTask.text);
    });

    it('should not get tasks without authentication', async () => {
      const res = await request(app)
        .get(`/api/tasks/date/${testTask.date}`);

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await Task.create({
        ...testTask,
        userId: new mongoose.Types.ObjectId(userId)
      }) as TaskDocument;
      
      taskId = task._id.toString();
    });

    it('should update a task', async () => {
      const updatedTask = {
        text: 'Updated task',
        date: '2024-01-29',
        order: 2
      };

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedTask);

      expect(res.status).toBe(200);
      expect(res.body.text).toBe(updatedTask.text);
      expect(res.body.order).toBe(updatedTask.order);
    });

    it('should not update task of another user', async () => {
      // Create another user and get their token
      const anotherUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'another@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${anotherUser.body.token}`)
        .send({
          text: 'Try to update',
          date: '2024-01-29',
          order: 3
        });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await Task.create({
        ...testTask,
        userId: new mongoose.Types.ObjectId(userId)
      }) as TaskDocument;
      
      taskId = task._id.toString();
    });

    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);

      // Verify task is deleted
      const task = await Task.findById(taskId);
      expect(task).toBeNull();
    });

    it('should not delete task without authentication', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`);

      expect(res.status).toBe(401);

      // Verify task still exists
      const task = await Task.findById(taskId);
      expect(task).not.toBeNull();
    });
  });
});

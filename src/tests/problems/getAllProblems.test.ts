import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import ProblemsRoute from '@/routes/problems.route';
import { Problem } from '@interfaces/problems.interface';
import problemModel from '@models/problems.model';
import { connect, disconnect } from 'mongoose';
import { dbConnection } from '@databases';

beforeAll(async () => {
  await connect(dbConnection.url);
  jest.setTimeout(10000);
});

afterAll(async () => {
  await disconnect();
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing GET /problems', () => {
  const problemsRoute = new ProblemsRoute();
  const mockProblems: Problem[] = [
    {
      _id: new mongoose.Types.ObjectId().toHexString(),
      title: 'Sample Problem 1',
      description: 'This is a test problem.',
      difficulty: 'Easy',
      tags: ['test', 'mock'],
      inputFormat: 'Input will be a single integer n.',
      outputFormat: 'Output should be the square of n.',
      examples: [
        { input: '2', output: '4' },
        { input: '3', output: '9' },
      ],
      constraints: '1 <= n <= 100',
      solution: 'Use basic math to square the input.',
      createdAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId().toHexString(),
      title: 'Sample Problem 2',
      description: 'Another test problem.',
      difficulty: 'Medium',
      tags: ['example', 'mock', 'test'],
      inputFormat: 'Input will be two integers a and b.',
      outputFormat: 'Output should be the sum of a and b.',
      examples: [
        { input: '1 2', output: '3' },
        { input: '5 10', output: '15' },
      ],
      constraints: '1 <= a, b <= 1000',
      solution: 'Add the two integers.',
      createdAt: new Date(),
    },
  ];

  beforeEach(async () => {
    await problemModel.insertMany(mockProblems);
  });

  afterEach(async () => {
    await problemModel.deleteMany({});
  });

  it('should return 200 status code', async () => {
    const app = new App([problemsRoute]);
    const res = await request(app.getServer()).get(`${problemsRoute.path}`);
    expect(res.status).toBe(200);
  });

  it('should return the correct message', async () => {
    const app = new App([problemsRoute]);
    const res = await request(app.getServer()).get(`${problemsRoute.path}`);
    expect(res.body.message).toBe('findAll');
  });

  it('should return a list of problems', async () => {
    const app = new App([problemsRoute]);
    const res = await request(app.getServer()).get(`${problemsRoute.path}`);

    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(mockProblems.length);
  });

  it('should return problems with correct structure', async () => {
    const app = new App([problemsRoute]);
    const res = await request(app.getServer()).get(`${problemsRoute.path}`);

    res.body.data.forEach((problem: Problem, index: number) => {
      expect(problem).toHaveProperty('_id');
      expect(typeof problem._id).toBe('string');
      expect(problem).toHaveProperty('title', mockProblems[index].title);
      expect(problem).toHaveProperty('description', mockProblems[index].description);
      expect(problem).toHaveProperty('difficulty', mockProblems[index].difficulty);
      expect(problem).toHaveProperty('tags', mockProblems[index].tags);
      expect(problem).toHaveProperty('inputFormat', mockProblems[index].inputFormat);
      expect(problem).toHaveProperty('outputFormat', mockProblems[index].outputFormat);
      expect(problem).toHaveProperty('examples', mockProblems[index].examples);
      expect(problem).toHaveProperty('constraints', mockProblems[index].constraints);
      expect(problem).toHaveProperty('solution', mockProblems[index].solution);
      expect(problem).toHaveProperty('createdAt');
    });
  });
});

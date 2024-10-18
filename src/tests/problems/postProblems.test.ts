import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import ProblemsRoute from '@/routes/problems.route';
import { CreateProblemDto } from '@/dtos/problems.dto';
import problemModel from '@models/problems.model';
import { connect, disconnect } from 'mongoose';
import { dbConnection } from '@databases';
import { difficulties } from '@/interfaces/problems.interface';

beforeAll(async () => {
  await connect(dbConnection.url);
  jest.setTimeout(10000);
});

afterAll(async () => {
  await disconnect();
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing POST /problems', () => {
  const problemsRoute = new ProblemsRoute();

  afterEach(async () => {
    await problemModel.deleteMany({});
  });

  it('should return 201 status and create a new problem', async () => {
    const app = new App([problemsRoute]);

    const newProblem: CreateProblemDto = {
      title: 'New Problem',
      description: 'This is a newly created problem.',
      difficulty: 'Easy',
      tags: ['test', 'new'],
      inputFormat: 'Input will be a single integer n.',
      outputFormat: 'Output should be the square of n.',
      examples: [
        { input: '2', output: '4' },
        { input: '3', output: '9' },
      ],
      constraints: '1 <= n <= 100',
      solution: 'Use basic math to square the input.',
    };

    const res = await request(app.getServer()).post(`${problemsRoute.path}`).send(newProblem);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.title).toBe(newProblem.title);
  });

  it('should return 400 status when required fields are missing', async () => {
    const app = new App([problemsRoute]);

    const invalidProblem = {
      title: '',
      description: '',
      difficulty: '',
      tags: [],
      inputFormat: '',
      outputFormat: '',
      examples: [],
      constraints: '',
      solution: '',
    };

    const res = await request(app.getServer()).post(`${problemsRoute.path}`).send(invalidProblem);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('difficulty must be one of the following values: ' + difficulties.join(', '));
  });

  it('should return 409 status when there is a conflict (e.g., duplicate problem)', async () => {
    const app = new App([problemsRoute]);

    const duplicateProblem: CreateProblemDto = {
      title: 'Duplicate Problem',
      description: 'This is a duplicate problem.',
      difficulty: 'Medium',
      tags: ['duplicate'],
      inputFormat: 'Input will be a single integer n.',
      outputFormat: 'Output should be the square of n.',
      examples: [{ input: '2', output: '4' }],
      constraints: '1 <= n <= 100',
      solution: 'Use basic math to square the input.',
    };

    await problemModel.create(duplicateProblem);

    const res = await request(app.getServer()).post(`${problemsRoute.path}`).send(duplicateProblem);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe(`This title ${duplicateProblem.title} already exists`);
  });

  it('should return 500 status for server error', async () => {
    const app = new App([problemsRoute]);

    jest.spyOn(problemModel, 'create').mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    });

    const validProblem: CreateProblemDto = {
      title: 'Server Error Problem',
      description: 'This should trigger a server error.',
      difficulty: 'Hard',
      tags: ['error'],
      inputFormat: 'Input will be a single integer n.',
      outputFormat: 'Output should be the square of n.',
      examples: [{ input: '2', output: '4' }],
      constraints: '1 <= n <= 100',
      solution: 'Use basic math to square the input.',
    };

    const res = await request(app.getServer()).post(`${problemsRoute.path}`).send(validProblem);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal Server Error');
  });
});

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

describe('Testing GET /problems/:id', () => {
  const problemsRoute = new ProblemsRoute();

  let createdProblemId: string;

  beforeEach(async () => {
    const newProblem: Problem = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      title: 'Sample Problem',
      description: 'This is a test problem.',
      difficulty: 'Easy',
      tags: ['test'],
      inputFormat: 'Input will be a single integer.',
      outputFormat: 'Output should be the square of the integer.',
      examples: [
        { input: '2', output: '4' },
        { input: '3', output: '9' },
      ],
      constraints: '1 <= n <= 100',
      solution: 'Use basic math.',
    };

    const createdProblem = await problemModel.create(newProblem);
    createdProblemId = createdProblem._id;
  });

  afterEach(async () => {
    await problemModel.deleteMany({});
  });

  it('should return 200 status and the correct problem when a valid ID is provided', async () => {
    const app = new App([problemsRoute]);

    const res = await request(app.getServer()).get(`${problemsRoute.path}/${createdProblemId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data._id).toBe(createdProblemId.toString());
    expect(res.body.data.title).toBe('Sample Problem');
  });

  it('should return 409 status when the problem ID format is invalid', async () => {
    const app = new App([problemsRoute]);

    const invalidId = new mongoose.Types.ObjectId().toHexString();

    const res = await request(app.getServer()).get(`${problemsRoute.path}/${invalidId}`);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Problem doesn't exist");
  });

  it('should return 500 status for server errors', async () => {
    const app = new App([problemsRoute]);

    jest.spyOn(problemModel, 'findById').mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    });

    const res = await request(app.getServer()).get(`${problemsRoute.path}/${createdProblemId}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal Server Error');
  });
});

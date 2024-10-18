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

describe('Testing DELETE /problems/:id', () => {
  const problemsRoute = new ProblemsRoute();
  let createdProblemId: string;

  beforeEach(async () => {
    const newProblem: Problem = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      title: 'Problem to be deleted',
      description: 'This problem will be deleted.',
      difficulty: 'Easy',
      tags: ['delete', 'test'],
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
    createdProblemId = createdProblem._id; // Store the ID for use in the tests
  });

  afterEach(async () => {
    await problemModel.deleteMany({});
  });

  it('should return 200 status and delete the problem successfully', async () => {
    const app = new App([problemsRoute]);

    const res = await request(app.getServer()).delete(`${problemsRoute.path}/${createdProblemId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data._id).toBe(createdProblemId.toString()); // Ensure the deleted problem's ID matches
  });

  it('should return 409 status when the problem does not exist', async () => {
    const app = new App([problemsRoute]);

    const nonExistentProblemId = new mongoose.Types.ObjectId().toHexString();

    const res = await request(app.getServer()).delete(`${problemsRoute.path}/${nonExistentProblemId}`);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Problem doesn't exist");
  });

  it('should return 500 status for server errors', async () => {
    const app = new App([problemsRoute]);

    // Mock the problemModel.findByIdAndDelete to throw an error
    jest.spyOn(problemModel, 'findByIdAndDelete').mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    });

    const res = await request(app.getServer()).delete(`${problemsRoute.path}/${createdProblemId}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal Server Error');
  });
});

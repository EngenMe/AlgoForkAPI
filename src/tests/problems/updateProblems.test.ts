import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import ProblemsRoute from '@/routes/problems.route';
import { CreateProblemDto } from '@/dtos/problems.dto';
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

describe('Testing PUT /problems/:id', () => {
  const problemsRoute = new ProblemsRoute();
  let createdProblemId: string;

  beforeEach(async () => {
    const newProblem: CreateProblemDto = {
      title: 'Original Problem',
      description: 'This is the original problem.',
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
    createdProblemId = createdProblem._id; // Store the ID for use in the tests
  });

  afterEach(async () => {
    await problemModel.deleteMany({});
  });

  it('should return 200 status and update the problem successfully', async () => {
    const app = new App([problemsRoute]);

    const updatedProblemData: CreateProblemDto = {
      title: 'Updated Problem',
      description: 'This is an updated problem.',
      difficulty: 'Medium',
      tags: ['update', 'test'],
      inputFormat: 'Updated input format.',
      outputFormat: 'Updated output format.',
      examples: [{ input: '5', output: '25' }],
      constraints: 'Updated constraints.',
      solution: 'Updated solution.',
    };

    const res = await request(app.getServer()).put(`${problemsRoute.path}/${createdProblemId}`).send(updatedProblemData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.title).toBe(updatedProblemData.title);
  });

  it('should return 400 status when the problem data is empty', async () => {
    const app = new App([problemsRoute]);

    const res = await request(app.getServer()).put(`${problemsRoute.path}/${createdProblemId}`).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('problemData is empty');
  });

  it('should return 409 status when the problem title already exists', async () => {
    const app = new App([problemsRoute]);

    // Create another problem with a conflicting title
    const existingProblem: CreateProblemDto = {
      title: 'Conflicting Problem',
      description: 'This problem has a conflicting title.',
      difficulty: 'Hard',
      tags: ['conflict'],
      inputFormat: 'Input will be conflicting.',
      outputFormat: 'Output should be conflicting.',
      examples: [{ input: '7', output: '49' }],
      constraints: 'Conflicting constraints.',
      solution: 'Conflicting solution.',
    };

    await problemModel.create(existingProblem);

    // Try to update the original problem with the conflicting title
    const res = await request(app.getServer()).put(`${problemsRoute.path}/${createdProblemId}`).send({ title: 'Conflicting Problem' });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('This title Conflicting Problem already exists');
  });

  it('should return 409 status when the problem does not exist', async () => {
    const app = new App([problemsRoute]);

    const nonExistentProblemId = new mongoose.Types.ObjectId().toHexString();

    const res = await request(app.getServer()).put(`${problemsRoute.path}/${nonExistentProblemId}`).send({
      title: 'Non-existent Problem',
      description: 'This is an updated problem.',
      difficulty: 'Medium',
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Problem doesn't exist");
  });

  it('should return 500 status for server errors', async () => {
    const app = new App([problemsRoute]);

    // Mock the problemModel.findByIdAndUpdate to throw an error
    jest.spyOn(problemModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    });

    const res = await request(app.getServer()).put(`${problemsRoute.path}/${createdProblemId}`).send({
      title: 'Problem Causing Server Error',
      description: 'This should trigger a server error.',
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal Server Error');
  });
});

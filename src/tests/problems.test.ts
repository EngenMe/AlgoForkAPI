import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import { CreateProblemDto } from '@/dtos/problems.dto';
import ProblemsRoute from '@/routes/problems.route';

beforeAll(async () => {
  jest.setTimeout(10000);
});
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Problems', () => {
  describe('[GET] /problems', () => {
    it('response findAll Problems', async () => {
      const problemsRoute = new ProblemsRoute();
      const problems = problemsRoute.problemsController.problemService.problems;

      problems.find = jest.fn().mockReturnValue([
        {
          title: 'Lorem Ipsum Problem',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.',
          difficulty: 'Easy',
          tags: ['Lorem', 'Ipsum', 'Array'],
          inputFormat: 'Array of integers.',
          outputFormat: 'Single integer representing result.',
          examples: [
            {
              input: '[1, 2, 3, 4, 5]',
              output: '15',
            },
          ],
          constraints: 'Array length should be between 1 and 1000. Values are between -1000 and 1000.',
          solution: 'Summing all elements in the array returns the result.',
        },
        {
          title: 'Dolor Sit Amet Problem',
          description: 'Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.',
          difficulty: 'Medium',
          tags: ['Dolor', 'Sit', 'Matrix'],
          inputFormat: 'A 2D matrix of integers.',
          outputFormat: 'The sum of elements in the matrix.',
          examples: [
            {
              input: '[[1, 2], [3, 4]]',
              output: '10',
            },
          ],
          constraints: 'Matrix dimensions between 1x1 and 1000x1000. Integer values are between -1000 and 1000.',
          solution: 'Iterate through the matrix and sum all the elements.',
        },
        {
          title: 'Consectetur Adipiscing Problem',
          description: 'Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.',
          difficulty: 'Hard',
          tags: ['Consectetur', 'Adipiscing', 'Graph'],
          inputFormat: 'A graph represented as an adjacency list.',
          outputFormat: 'The shortest path between two nodes.',
          examples: [
            {
              input: "{'A': ['B', 'C'], 'B': ['A', 'D'], 'C': ['A', 'D'], 'D': ['B', 'C']}",
              output: '2',
            },
          ],
          constraints: 'Number of nodes between 2 and 1000. Each edge has a positive weight.',
          solution: "Use Dijkstra's algorithm to find the shortest path between the nodes.",
        },
      ]);

      (mongoose as any).connect = jest.fn();
      const app = new App([problemsRoute]);

      return request(app.getServer()).get(`${problemsRoute.path}`).expect(200);
    });
  });

  describe('[GET] /problems/:id', () => {
    it('response findOne Problem', async () => {
      const problemId = 'qpwoeiruty';

      const problemsRoute = new ProblemsRoute();
      const problems = problemsRoute.problemsController.problemService.problems;

      problems.findOne = jest.fn().mockReturnValue({
        _id: 'qpwoeiruty',
        title: 'Lorem Ipsum Problem',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.',
        difficulty: 'Easy',
        tags: ['Lorem', 'Ipsum', 'Array'],
        inputFormat: 'Array of integers.',
        outputFormat: 'Single integer representing result.',
        examples: [
          {
            input: '[1, 2, 3, 4, 5]',
            output: '15',
          },
        ],
        constraints: 'Array length should be between 1 and 1000. Values are between -1000 and 1000.',
        solution: 'Summing all elements in the array returns the result.',
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([problemsRoute]);
      return request(app.getServer()).get(`${problemsRoute.path}/${problemId}`).expect(200);
    });
  });

  // describe('[POST] /problems', () => {
  //   it('response Create Problem', async () => {
  //     const problemData: CreateProblemDto = {
  //       email: 'test@email.com',
  //       password: 'q1w2e3r4',
  //     };

  //     const problemsRoute = new ProblemsRoute();
  //     const problems = problemsRoute.problemsController.problemService.problems;

  //     problems.findOne = jest.fn().mockReturnValue(null);
  //     problems.create = jest.fn().mockReturnValue({
  //       _id: '60706478aad6c9ad19a31c84',
  //       email: problemData.email,
  //       password: await bcrypt.hash(problemData.password, 10),
  //     });

  //     (mongoose as any).connect = jest.fn();
  //     const app = new App([problemsRoute]);
  //     return request(app.getServer()).post(`${problemsRoute.path}`).send(problemData).expect(201);
  //   });
  // });

  // describe('[PUT] /problems/:id', () => {
  //   it('response Update Problem', async () => {
  //     const problemId = '60706478aad6c9ad19a31c84';
  //     const problemData: CreateProblemDto = {
  //       email: 'test@email.com',
  //       password: 'q1w2e3r4',
  //     };

  //     const problemsRoute = new ProblemsRoute();
  //     const problems = problemsRoute.problemsController.problemService.problems;

  //     if (problemData.email) {
  //       problems.findOne = jest.fn().mockReturnValue({
  //         _id: problemId,
  //         email: problemData.email,
  //         password: await bcrypt.hash(problemData.password, 10),
  //       });
  //     }

  //     problems.findByIdAndUpdate = jest.fn().mockReturnValue({
  //       _id: problemId,
  //       email: problemData.email,
  //       password: await bcrypt.hash(problemData.password, 10),
  //     });

  //     (mongoose as any).connect = jest.fn();
  //     const app = new App([problemsRoute]);
  //     return request(app.getServer()).put(`${problemsRoute.path}/${problemId}`).send(problemData);
  //   });
  // });

  // describe('[DELETE] /problems/:id', () => {
  //   it('response Delete Problem', async () => {
  //     const problemId = '60706478aad6c9ad19a31c84';

  //     const problemsRoute = new ProblemsRoute();
  //     const problems = problemsRoute.problemsController.problemService.problems;

  //     problems.findByIdAndDelete = jest.fn().mockReturnValue({
  //       _id: '60706478aad6c9ad19a31c84',
  //       email: 'test@email.com',
  //       password: await bcrypt.hash('q1w2e3r4!', 10),
  //     });

  //     (mongoose as any).connect = jest.fn();
  //     const app = new App([problemsRoute]);
  //     return request(app.getServer()).delete(`${problemsRoute.path}/${problemId}`).expect(200);
  //   });
  // });
});

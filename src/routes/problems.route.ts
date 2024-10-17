import { Router } from 'express';
import ProblemsController from '@controllers/problems.controller';
import { CreateProblemDto } from '@dtos/problems.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class ProblemsRoute implements Routes {
  public path = '/problems';
  public router = Router();
  public problemsController = new ProblemsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.problemsController.getProblems);
    this.router.get(`${this.path}/:id`, this.problemsController.getProblemById);
    this.router.post(`${this.path}`, validationMiddleware(CreateProblemDto, 'body'), this.problemsController.createProblem);
    this.router.put(`${this.path}/:id`, validationMiddleware(CreateProblemDto, 'body', true), this.problemsController.updateProblem);
    this.router.delete(`${this.path}/:id`, this.problemsController.deleteProblem);
  }
}

export default ProblemsRoute;

import { NextFunction, Request, Response } from 'express';
import { CreateProblemDto } from '@dtos/problems.dto';
import { Problem } from '@interfaces/problems.interface';
import problemService from '@/services/problems.service';

class ProblemsController {
  public problemService = new problemService();

  public getProblems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllProblemsData: Problem[] = await this.problemService.findAllProblem();

      res.status(200).json({ data: findAllProblemsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getProblemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const problemId: string = req.params.id;
      const findOneProblemData: Problem = await this.problemService.findProblemById(problemId);

      res.status(200).json({ data: findOneProblemData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createProblem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const problemData: CreateProblemDto = req.body;
      const createProblemData: Problem = await this.problemService.createProblem(problemData);

      res.status(201).json({ data: createProblemData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateProblem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const problemId: string = req.params.id;
      const problemData: CreateProblemDto = req.body;
      const updateProblemData: Problem = await this.problemService.updateProblem(problemId, problemData);

      res.status(200).json({ data: updateProblemData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProblem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const problemId: string = req.params.id;
      const deleteProblemData: Problem = await this.problemService.deleteProblem(problemId);

      res.status(200).json({ data: deleteProblemData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProblemsController;

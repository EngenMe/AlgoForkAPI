import { CreateProblemDto } from '@dtos/problems.dto';
import { HttpException } from '@exceptions/HttpException';
import { Problem } from '@interfaces/problems.interface';
import problemModel from '@models/problems.model';
import { isEmpty } from '@utils/util';

class ProblemService {
  public problems = problemModel;

  public async findAllProblem(): Promise<Problem[]> {
    const problems: Problem[] = await this.problems.find();
    return problems;
  }

  public async findProblemById(problemId: string): Promise<Problem> {
    if (isEmpty(problemId)) throw new HttpException(400, 'ProblemId is empty');

    const findProblem: Problem = await this.problems.findById(problemId);
    if (!findProblem) throw new HttpException(409, "Problem doesn't exist");

    return findProblem;
  }

  public async createProblem(problemData: CreateProblemDto): Promise<Problem> {
    if (isEmpty(problemData)) throw new HttpException(400, 'problemData is empty');

    const findProblem: Problem = await this.problems.findOne({ title: problemData.title });
    if (findProblem) throw new HttpException(409, `This title ${problemData.title} already exists`);

    const createProblemData: Problem = await this.problems.create(problemData);

    return createProblemData;
  }

  public async updateProblem(problemId: string, problemData: CreateProblemDto): Promise<Problem> {
    if (isEmpty(problemData)) throw new HttpException(400, 'problemData is empty');

    if (problemData.title) {
      const findProblem: Problem = await this.problems.findOne({ title: problemData.title });
      if (findProblem && findProblem._id != problemId) throw new HttpException(409, `This title ${problemData.title} already exists`);
    }

    const updateProblemById: Problem = await this.problems.findByIdAndUpdate(problemId, { $set: problemData }, { new: true });
    if (!updateProblemById) throw new HttpException(409, "Problem doesn't exist");

    return updateProblemById;
  }

  public async deleteProblem(problemId: string): Promise<Problem> {
    const deleteProblemById: Problem = await this.problems.findByIdAndDelete(problemId);
    if (!deleteProblemById) throw new HttpException(409, "Problem doesn't exist");

    return deleteProblemById;
  }
}

export default ProblemService;

export const difficulties = ['Easy', 'Medium', 'Hard'] as const;
type Difficulty = (typeof difficulties)[number];

export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  inputFormat: string;
  outputFormat: string;
  examples: { input: string; output: string }[];
  constraints: string;
  solution?: string;
  createdAt?: Date;
}

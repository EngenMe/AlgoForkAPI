export interface Problem {
  _id: string,
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard'; 
  tags: string[];
  inputFormat: string;
  outputFormat: string;
  examples: { input: string; output: string }[]; 
  constraints: string;
  solution?: string; 
  createdAt?: Date; 
}


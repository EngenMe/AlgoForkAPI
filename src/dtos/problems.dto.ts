import { IsString, IsArray, IsIn, IsOptional } from 'class-validator';

export class CreateProblemDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsIn(['Easy', 'Medium', 'Hard'])
  public difficulty: string;

  @IsArray()
  @IsString({ each: true })
  public tags: string[];

  @IsString()
  public inputFormat: string;

  @IsString()
  public outputFormat: string;

  @IsArray()
  public examples: { input: string; output: string }[];

  @IsString()
  public constraints: string;

  @IsOptional() // Optional field
  @IsString()
  public solution?: string;
}

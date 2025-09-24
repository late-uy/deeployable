import { IsInt, IsObject, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateEnvironmentDto {
  @IsInt()
  @Min(1)
  projectId!: number;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  subdomainPrefix!: string;

  @IsObject()
  envVars!: Record<string, string>;
}

export class UpdateEnvironmentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  subdomainPrefix?: string;

  @IsOptional()
  @IsObject()
  envVars?: Record<string, string>;
}



import { IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsString()
  @IsUrl({ require_tld: false })
  repoUrl!: string;

  @IsString()
  @MinLength(1)
  branch!: string;

  @IsString()
  @MinLength(1)
  buildCmd!: string;

  @IsString()
  @MinLength(1)
  startCmd!: string;

  @IsInt()
  @Min(1)
  runtimePort!: number;

  @IsOptional()
  @IsInt()
  createdById?: number;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  repoUrl?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  branch?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  buildCmd?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  startCmd?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  runtimePort?: number;

  @IsOptional()
  @IsInt()
  createdById?: number;
}



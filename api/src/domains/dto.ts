import { IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class CreateDomainDto {
  @IsInt()
  @Min(1)
  projectId!: number;

  @IsString()
  @MinLength(1)
  host!: string;

  @IsString()
  @MinLength(1)
  type!: string; // e.g., "custom"

  @IsOptional()
  @IsUrl({ require_tld: false })
  targetUrl?: string;
}



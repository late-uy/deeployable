import { IsOptional, IsString } from 'class-validator';

export class CreateEnvironmentDto {
  @IsString()
  name!: string;

  @IsString()
  branch!: string;
}

export class UpdateEnvironmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  branch?: string;
}

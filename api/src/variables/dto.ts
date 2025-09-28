import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateVariableDto {
  @IsInt()
  environmentId!: number;

  @IsString()
  key!: string;

  @IsString()
  value!: string;

  @IsOptional()
  @IsBoolean()
  isSecret?: boolean;
}

export class UpdateVariableDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsBoolean()
  isSecret?: boolean;
}

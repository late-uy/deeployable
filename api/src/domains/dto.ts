import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateDomainDto {
  @IsInt()
  environmentId!: number;

  @IsString()
  hostname!: string;
}

export class VerifyDomainDto {
  @IsBoolean()
  verified!: boolean;
}

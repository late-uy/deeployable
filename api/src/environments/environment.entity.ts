export interface Environment {
  id: number;
  projectId: number;
  name: string;
  subdomainPrefix: string;
  envVars: Record<string, string>;
}

export interface CreateEnvironmentDto {
  projectId: number;
  name: string;
  subdomainPrefix: string;
  envVars: Record<string, string>;
}

export type UpdateEnvironmentDto = Partial<CreateEnvironmentDto>;



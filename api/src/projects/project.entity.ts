export interface Project {
  id: number;
  name: string;
  repoUrl: string;
  branch: string;
  buildCmd: string;
  startCmd: string;
  runtimePort: number;
}

export interface CreateProjectDto {
  name: string;
  repoUrl: string;
  branch: string;
  buildCmd: string;
  startCmd: string;
  runtimePort: number;
}

export type UpdateProjectDto = Partial<CreateProjectDto>;



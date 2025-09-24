export interface Project {
  id: number;
  name: string;
  repoUrl: string;
  branch: string;
  buildCmd: string;
  startCmd: string;
  runtimePort: number;
}

// Legacy DTOs replaced by class-validator DTOs in dto.ts



import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { EnvironmentsModule } from './environments/environments.module.js';
import { VariablesModule } from './variables/variables.module.js';
import { DomainsModule } from './domains/domains.module.js';
import { DeploysModule } from './deploys/deploys.module.js';
import { HooksModule } from './hooks/hooks.module.js';
import { PlatformModule } from './platform/platform.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    EnvironmentsModule,
    VariablesModule,
    DomainsModule,
    DeploysModule,
    HooksModule,
    PlatformModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

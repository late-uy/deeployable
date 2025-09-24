import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { EnvironmentsModule } from './environments/environments.module';
import { PrismaModule } from './prisma/prisma.module';
import { HooksModule } from './hooks/hooks.module';
import { DeploysModule } from './deploys/deploys.module';
import { DomainsModule } from './domains/domains.module';
import { PlatformModule } from './platform/platform.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ProjectsModule, EnvironmentsModule, HooksModule, DeploysModule, DomainsModule, PlatformModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }));
	const prisma = app.get(PrismaService);
	await prisma.enableShutdownHooks(app);
	await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

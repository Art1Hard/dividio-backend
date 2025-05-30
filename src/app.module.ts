import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { IncomeModule } from './income/income.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		UserModule,
		IncomeModule,
	],
	controllers: [AppController],
	providers: [PrismaService, AppService],
})
export class AppModule {}

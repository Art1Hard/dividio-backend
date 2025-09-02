import { Module } from "@nestjs/common";
import { PrismaService } from "./services/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { IncomeModule } from "./income/income.module";
import { AllocationModule } from "./allocation/allocation.module";
import { StatisticModule } from "./statistic/statistic.module";
import { AllocationColorModule } from "./allocation-color/allocation-color.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		UserModule,
		IncomeModule,
		AllocationModule,
		StatisticModule,
		AllocationColorModule,
	],
	controllers: [],
	providers: [PrismaService],
})
export class AppModule {}

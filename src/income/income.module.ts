import { Module } from "@nestjs/common";
import { IncomeService } from "./income.service";
import { IncomeController } from "./income.controller";
import { PrismaService } from "src/services/prisma.service";
import { AllocationModule } from "src/allocation/allocation.module";
import { ValidationService } from "src/services/validation.service";
import { StatisticModule } from "src/statistic/statistic.module";

@Module({
	imports: [AllocationModule, StatisticModule],
	controllers: [IncomeController],
	providers: [PrismaService, IncomeService, ValidationService],
	exports: [IncomeService],
})
export class IncomeModule {}

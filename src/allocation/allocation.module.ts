import { Module } from "@nestjs/common";
import { AllocationService } from "./allocation.service";
import { AllocationController } from "./allocation.controller";
import { PrismaService } from "src/services/prisma.service";
import { ValidationService } from "src/services/validation.service";
import { StatisticModule } from "src/statistic/statistic.module";

@Module({
	imports: [StatisticModule],
	controllers: [AllocationController],
	providers: [PrismaService, AllocationService, ValidationService],
	exports: [AllocationService],
})
export class AllocationModule {}

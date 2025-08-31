import { Module } from "@nestjs/common";
import { AllocationService } from "./allocation.service";
import { AllocationController } from "./allocation.controller";
import { PrismaService } from "src/services/prisma.service";
import { ValidationService } from "src/services/validation.service";
import { StatisticService } from "src/statistic/statistic.service";

@Module({
	controllers: [AllocationController],
	providers: [
		PrismaService,
		AllocationService,
		ValidationService,
		StatisticService,
	],
	exports: [AllocationService],
})
export class AllocationModule {}

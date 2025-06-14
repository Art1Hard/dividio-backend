import { Module } from "@nestjs/common";
import { AllocationService } from "./allocation.service";
import { AllocationController } from "./allocation.controller";
import { PrismaService } from "src/services/prisma.service";
import { IncomeModule } from "src/income/income.module";
import { ValidationService } from "src/services/validation.service";

@Module({
	imports: [IncomeModule],
	controllers: [AllocationController],
	providers: [PrismaService, AllocationService, ValidationService],
})
export class AllocationModule {}

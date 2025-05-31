import { Module } from "@nestjs/common";
import { AllocationService } from "./allocation.service";
import { AllocationController } from "./allocation.controller";
import { PrismaService } from "src/prisma.service";
import { IncomeModule } from "src/income/income.module";

@Module({
	imports: [IncomeModule],
	controllers: [AllocationController],
	providers: [PrismaService, AllocationService],
})
export class AllocationModule {}

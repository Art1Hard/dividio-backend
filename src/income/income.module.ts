import { forwardRef, Module } from "@nestjs/common";
import { IncomeService } from "./income.service";
import { IncomeController } from "./income.controller";
import { PrismaService } from "src/services/prisma.service";
import { AllocationModule } from "src/allocation/allocation.module";

@Module({
	imports: [forwardRef(() => AllocationModule)],
	controllers: [IncomeController],
	providers: [PrismaService, IncomeService],
	exports: [IncomeService],
})
export class IncomeModule {}

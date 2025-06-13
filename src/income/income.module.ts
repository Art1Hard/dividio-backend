import { Module } from "@nestjs/common";
import { IncomeService } from "./income.service";
import { IncomeController } from "./income.controller";
import { PrismaService } from "src/prisma.service";

@Module({
	controllers: [IncomeController],
	providers: [PrismaService, IncomeService],
	exports: [IncomeService],
})
export class IncomeModule {}

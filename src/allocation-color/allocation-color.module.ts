import { Module } from "@nestjs/common";
import { AllocationColorService } from "./allocation-color.service";
import { AllocationColorController } from "./allocation-color.controller";
import { PrismaService } from "src/services/prisma.service";

@Module({
	controllers: [AllocationColorController],
	providers: [PrismaService, AllocationColorService],
})
export class AllocationColorModule {}

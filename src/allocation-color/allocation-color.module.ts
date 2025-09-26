import { Module } from "@nestjs/common";
import { AllocationColorService } from "./allocation-color.service";
import { AllocationColorController } from "./allocation-color.controller";
import { PrismaService } from "src/services/prisma.service";
import { AllocationModule } from "src/allocation/allocation.module";

@Module({
	imports: [AllocationModule],
	controllers: [AllocationColorController],
	providers: [PrismaService, AllocationColorService],
})
export class AllocationColorModule {}

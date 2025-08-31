import { Module } from "@nestjs/common";
import { StatisticService } from "./statistic.service";
import { StatisticController } from "./statistic.controller";
import { PrismaService } from "src/services/prisma.service";

@Module({
	controllers: [StatisticController],
	providers: [PrismaService, StatisticService],
	exports: [StatisticService],
})
export class StatisticModule {}

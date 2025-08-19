import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { StatisticService } from "./statistic.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RequestWithUser } from "src/types/request";

@Controller("statistic")
export class StatisticController {
	constructor(private readonly statisticService: StatisticService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	async get(@Req() req: RequestWithUser) {
		const totalIncomesAmount =
			await this.statisticService.getTotalIncomesAmount(req.user.id);
		const totalIncomes = await this.statisticService.getTotalIncomes(
			req.user.id
		);
		const freePercentage = await this.statisticService.getFreePercentage(
			req.user.id
		);
		return { totalIncomesAmount, totalIncomes, freePercentage };
	}
}
